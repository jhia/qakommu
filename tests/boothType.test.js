const request = require('supertest')
const app = require('../app')

let accessToken = '';
let headers = {};

let editingEvent = null;

beforeAll(async () => {
  let { body: { payload } } = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
    email: 'p_ellett87@kommu.com',
    password: '123'
  });

  accessToken = payload.accessToken;

  headers = {
    'Authorization': 'Bearer ' + accessToken
  }
})


describe('Booth Type API', () => {

  describe('Get booth types from community', () => {
    it('should show all available booths', async () => {
      const res = await request(app).get('/api/boothType/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('should show one booth', async () => {
      const res = await request(app).get('/api/boothType/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.name).toBe('general')
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).get('/api/boothType/test').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Booth type id is not valid')
    })
  })

  describe('Create booth type', () => {
    it('should create a new booth', async () => {
      const goodEvent = {
        name: 'My new booth',
        description: 'My new booth with name and size',
        width: 1000,
        height: 800,
        community: 1
      }
      
      const res = await request(app).post('/api/boothType').set(headers).send(goodEvent)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect({
        name: res.body.payload.name,
        description: res.body.payload.description,
        width: res.body.payload.width,
        height: res.body.payload.height,
        community: res.body.payload.communityId
      }).toEqual(goodEvent)
      expect(res.body.payload.active).toEqual(true)
      editingEvent = res.body.payload;
    })

    it('should show error creating booth type if you are not the community owner', async () => {
      throw new Error();
    })
    
    it('should show error creating booth type for missing inputs', async () => {
      const badEvent = {
        description: 'my new booth without name and size'
      }
      const res = await request(app).post('/api/boothType').set(headers).send(badEvent)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Bad Request')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.name).toBe('Name is required')
      expect(res.body.payload.width).toBe('Width is required')
      expect(res.body.payload.height).toBe('Height is required')
    })
  })

  describe('Update booth types', () => {
    it('should update booth types', async () => {
      const updateEvent = {
        name: 'My test2',
        description: 'My test2 description',
        active: false
      }
  
      const res = await request(app).put(`/api/boothType/${editingEvent.id}`).set(headers).send(updateEvent)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await request(app).get(`/api/boothType/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.name).toBe(updateEvent.name)
      expect(res2.body.payload.description).toBe(updateEvent.description)
      expect(res2.body.payload.active).toBe(false)
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).put('/api/boothType/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Booth type id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await request(app).delete('/api/boothType/200051').set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Booth type does not exists')
    })

  })

  describe('Delete booth type', () => {
    it('should delete booths', async () => {
      const res = await request(app).delete(`/api/boothType/${editingEvent.id}`).set(headers)
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await request(app).get(`/api/boothType/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toEqual(false)
      expect(res2.body.message).toBe('Booth type not found')
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).delete('/api/boothType/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await request(app).delete('/api/boothType/200051').set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Booth type does not exists')
    })
  })
})
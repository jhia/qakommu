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


describe('Events API', () => {

  describe('Get events', () => {
    it('should show all available events', async () => {
      const res = await request(app).get('/api/event').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('should show one event', async () => {
      const res = await request(app).get('/api/event/3').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.name).toBe('microsoft ignite')
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).get('/api/event/microsoft-ignite').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })
  })

  describe('Create events', () => {
    it('should create a new event', async () => {
      const goodEvent = {
        name: 'My event',
        description: 'My new event with name and type',
        type: 'w',
        url: 'event.test.com',
        community: 1
      }
      
      const res = await request(app).post('/api/event').set(headers).send(goodEvent)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect({
        name: res.body.payload.name,
        description: res.body.payload.description,
        type: res.body.payload.type,
        url: res.body.payload.url,
        community: res.body.payload.communityId
      }).toEqual(goodEvent)
      expect(res.body.payload.online).toEqual(true)
      editingEvent = res.body.payload;
    })

    it('should show error creating events if you are not the community owner', async () => {
      const goodEvent = {
        name: 'My event',
        description: 'My new event with name and type',
        type: 'w',
        url: 'event.test.com',
        community: 4
      }
      
      const res = await request(app).post('/api/event').set(headers).send(goodEvent)
  
      expect(res.statusCode).toEqual(401)
      expect(res.body.successful).toEqual(false)
    })
    
    it('should show error creating events for missing inputs', async () => {
      const badEvent = {
        description: 'my new event without name and type'
      }
      const res = await request(app).post('/api/event').set(headers).send(badEvent)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Bad Request')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.name).toBe('Name is required')
      expect(res.body.payload.type).toBe('Type is required')
    })
  })

  describe('Update events', () => {
    it('should update event', async () => {
      const updateEvent = {
        name: 'My testing event',
        description: 'My testing event description'
      }
  
      const res = await request(app).put(`/api/event/${editingEvent.id}`).set(headers).send(updateEvent)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await request(app).get(`/api/event/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.name).toBe(updateEvent.name)
      expect(res2.body.payload.description).toBe(updateEvent.description)
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).put('/api/event/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await request(app).delete('/api/event/200051').set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('This event does not exists')
    })

  })

  describe('Delete events', () => {
    it('should delete event', async () => {
      const res = await request(app).delete(`/api/event/${editingEvent.id}`).set(headers)
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await request(app).get(`/api/event/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toEqual(false)
      expect(res2.body.message).toBe('Event not found')
    })

    it('should show error if the id is not valid', async () => {
      const res = await request(app).delete('/api/event/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await request(app).delete(`/api/event/550001`).set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('This event does not exists')
    })
  })
})
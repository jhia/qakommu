const request = require('supertest')
const app = require('../app');

let accessToken = '';
let headers = {};

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

  it('should show all available events', async () => {
    const res = await request(app).get('/api/event').set(headers)
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
  })

  it('should show a single event', async () => {
    const res = await request(app).get('/api/event/3').set(headers)
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.name).toBe('microsoft ignite')
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

  it('should create new event', async () => {
    const goodEvent = {
      name: 'My event',
      description: 'My new event with name and type',
      type: 'w',
      url: 'event.test.com'
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
      url: res.body.payload.url
    }).toEqual(goodEvent)
    expect(res.body.payload.online).toEqual(true)
  })

  it('should update the event', async () => {
    const updateEvent = {
      name: 'My testing event',
      description: 'My testing event description'
    }

    const res = await request(app).put('/api/event/3').set(headers).send(updateEvent)

    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body.message).toBe('OK')

    const res2 = await request(app).get('/api/event/3').set(headers)

    expect(res2.statusCode).toEqual(200)
    expect(res2.body.successful).toEqual(true)
    expect(res2.body.message).toBe('OK')
    expect(res2.body).toHaveProperty('payload')
    expect(res2.body.payload.name).toBe(updateEvent.name)
    expect(res2.body.payload.description).toBe(updateEvent.description)
  })

  it('should delete the event', async () => {
    
  })
})
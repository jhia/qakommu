const http = require('http')
const request = require('supertest')
const app = require('../app')
let accessToken = '';
let headers = {};

let editing = null;

let server, agent;

beforeEach((done) => {
    server = http.createServer(app).listen((err) => {
      if (err) return done(err);

       agent = request.agent(server); // since the application is already listening, it should use the allocated port
       done();
    });
});

afterEach((done) => {
  return server && server.close(done);
});

beforeAll(async () => {
  let token = 'Authentication=2hKy3LWUVZjjcI2ig1Tp3Qc1WMBYJrURyCPsKBlBIQsQlJWPs5HMrTYMS4ZR2Yl9Za4KdvZrq84bBrGc7upHDKt1Uh3jWbd8fpyCXIfOSSDUuYBWXljESey5KFcHFxKgazRzFTgTRBq9rwl9qhN4RBY43vWDnhNGEgOhONbm4D2DfsRVkyKMlYdfsCIDnyTHx7elYnpJb4aL6a1lAHLF3vYcobhRdUs0gXiW5ffldjRAxLXm3fdt9kB2cHaOW3X8; Path=/';
  let res = await request(app).post('/authorize').set('Cookie', token).send({});

  if(res.statusCode !== 200) {
    console.log(res.body.message)
    let err = new Error(res.body.message)
    throw err;
  }

  accessToken = res.body.payload.accessToken;

  headers = {
    'Authorization': 'Bearer ' + accessToken
  }
})


describe('Partnerships API', () => {

  describe('Get Partners', () => {
    it('/api/partnership/ should show all available partnerships', async () => {
      const res = await agent.get('/api/partnership2').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('/api/partnership/{id} should show one partner', async () => {
      const res = await agent.get('/api/partnership/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      const expectedResponse = {
        id: 1,
        name: "Google company",
        description: "test description",
        web: "www.google.com",
        active: true,
        name: "Pedro Laguna auditory",
        description: "esta ubicada en coro",
        maxCapacity: 550,
        active: true,
        isOnline: false,
        eventId: 2,
        urlClassroom: null
      }
      expect(res.body.payload).toEqual(expectedResponse)
    })
    
    it('/api/room/{id} should show error if the id is not valid', async () => {
      const res = await agent.get('/api/room/jenkins').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Room id is not valid')
    })

    it('/api/room/ should show nothing', async () => {
      const res = await agent.get('/api/room/').set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.payload).toBeUndefined()
    })
    
  })

  describe('Create room', () => {
    it('/api/room/event/{id} should create a new room for event', async () => {
      const good = {
        name: 'My new Room',
        description: 'My new room description',
        isOnline: true,
        urlClassroom: 'meet.google.com/w/my-new-room',
        active: true,
        maxCapacity: 0
      }
      
      const res = await agent.post('/api/room/event/1').set(headers).send(good)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      expect(res.body.payload.isOnline).toBe(true)
      expect(res.body.payload.name).toBe(good.name)
      editing = res.body.payload;
    })
    
    it('/api/room/event/{id} should show error creating room with wrong or missing inputs', async () => {
      const bad = {
        name: 23,
        isOnline: true
      }
      const res = await agent.post('/api/room/event/1').set(headers).send(bad)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.payload.name).toBe('Name is not valid')
      expect(res.body.payload.description).toBe('Description is required')
      expect(res.body.payload.urlClassroom).toBe('URL for classroom is required')
    })
  })

  describe('Update room', () => {
    it('/api/room/{id} should update information', async () => {
      const update = {
        name: 'My test room',
        maxCapacity: 53,
        active: false
      }
  
      const res = await agent.put(`/api/room/${editing.id}`).set(headers).send(update)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/room/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.name).toBe(update.name)
      expect(res2.body.payload.maxCapacity).toBe(update.maxCapacity)
      expect(res2.body.payload.active).toBe(false)
    })

    it('/api/room/{id} should show error if the id is not valid', async () => {
      const res = await agent.put('/api/room/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Room id is not valid')
    })

  })

  describe('Delete rooms', () => {
    it('/api/room/{id} should delete room', async () => {
      const res = await agent.delete(`/api/room/${editing.id}`).set(headers)
      .send({})
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/room/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toEqual(false)
      expect(res2.body.message).toBe('Room does not exist')
    })
  })
})
const request = require('supertest')
const app = require('../app')
let accessToken = '';
let headers = {};

let editingEvent = null;

let server, agent;

beforeEach((done) => {
    server = app.listen(process.env.PORT || 9000, (err) => {
      if (err) return done(err);

       agent = request.agent(server); // since the application is already listening, it should use the allocated port
       done();
    });
});

afterEach((done) => {
  return server && server.close(done);
});

beforeAll(async () => {
  let token = '2hKy3LWUVZjjcI2ig1Tp3Qc1WMBYJrURyCPsKBlBIQsQlJWPs5HMrTYMS4ZR2Yl9Za4KdvZrq84bBrGc7upHDKt1Uh3jWbd8fpyCXIfOSSDUuYBWXljESey5KFcHFxKgazRzFTgTRBq9rwl9qhN4RBY43vWDnhNGEgOhONbm4D2DfsRVkyKMlYdfsCIDnyTHx7elYnpJb4aL6a1lAHLF3vYcobhRdUs0gXiW5ffldjRAxLXm3fdt9kB2cHaOW3X8';
  let res = await request(app).post('/authorize').set({ 'Authentication': token }).send({});

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


describe('Events API', () => {

  describe('Get events', () => {
    it('should show all available events for community', async () => {
      const res = await agent.get('/api/event/community/KOMMMU').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('should show one event', async () => {
      const res = await agent.get('/api/event/3').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.name).toBe('microsoft ignite')
    })

    it('should show error if the id is not valid', async () => {
      const res = await agent.get('/api/event/microsoft-ignite').set(headers)
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
      
      const res = await agent.post('/api/event/community/KOMMMU').set(headers).send(goodEvent)
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
      }
      
      const res = await agent.post('/api/event/community/0JWCT2').set(headers).send(goodEvent)
  
      expect(res.statusCode).toEqual(401)
      expect(res.body.successful).toEqual(false)
    })
    
    it('should show error creating events for missing inputs', async () => {
      const badEvent = {
        description: 'my new event without name and type'
      }
      const res = await agent.post('/api/event/community/KOMMMU').set(headers).send(badEvent)
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
  
      const res = await agent.put(`/api/event/${editingEvent.id}`).set(headers).send(updateEvent)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/event/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.name).toBe(updateEvent.name)
      expect(res2.body.payload.description).toBe(updateEvent.description)
    })

    it('should show error if the id is not valid', async () => {
      const res = await agent.put('/api/event/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await agent.delete('/api/event/200051').set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event does not exist')
    })

  })

  describe('Delete events', () => {
    it('should delete event', async () => {
      const res = await agent.delete(`/api/event/${editingEvent.id}`).set(headers)
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/event/${editingEvent.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toEqual(false)
    })

    it('should show error if the id is not valid', async () => {
      const res = await agent.delete('/api/event/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await agent.delete(`/api/event/550001`).set(headers)
      expect(res.statusCode).toEqual(404)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Event does not exist')
    })
  })
})
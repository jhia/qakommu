const request = require('supertest')
const app = require('../app')
let accessToken = '';
let headers = {};

let editing = null;

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


describe('Attendees API', () => {

  describe('Get Attendees', () => {
    it('/api/attendee/event/{id} should show all available attendees', async () => {
      const res = await agent.get('/api/attendee/event/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('/api/attendee/{id} should show one attendee', async () => {
      const res = await agent.get('/api/attendee/3').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.email).toBe('j_jenkins988@kommu.com')
    })
    
    it('/api/attendee/{id} should show error if the id is not valid', async () => {
      const res = await agent.get('/api/attendee/jenkins').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Attendee id is not valid')
    })
    
  })

  describe('Create attendee', () => {
    it('/api/attendee/event/{id} should create a new attendee for event', async () => {
      const good = {
        email: 'p_ellett87@kommu.com',
        isPresent: true,
        ticket: 'cbd52136-c8c8-447e-9f29-9735458e98ff'
      }
      
      const res = await agent.post('/api/attendee/event/1').set(headers).send(good)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      expect(res.body.payload.isPresent).toBe(true)
      expect(res.body.payload.email).toBe('p_ellett87@kommu.com')
      editing = res.body.payload;
    })
    
    it('/api/attendee/event/{id} should show error creating attendee with used tickets', async () => {
      const bad = {
        email: 'p_ellett88@kommu.com',
        isPresent: true,
        ticket: 'cbd52136-c8c8-447e-9f29-9735458e98ff'
      }
      const res = await agent.post('/api/attendee/event/1').set(headers).send(bad)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Ticket already used')
    })
  })

  describe('Update attendee', () => {
    it('/api/attendee/{id} should update attendee information', async () => {
      const update = {
        firstName: 'Ellet',
        email: 'p_ellett_89@kommu.com'
      }
  
      const res = await agent.put(`/api/attendee/${editing.id}`).set(headers).send(update)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/attendee/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.firstName).toBe(update.firstName)
      expect(res2.body.payload.email).toBe(update.email)
    })

    it('should show error if the id is not valid', async () => {
      const res = await agent.put('/api/attendee/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Attendee id is not valid')
    })

  })

  describe('Delete attendee', () => {
    it('should delete attendee', async () => {
      const res = await agent.delete(`/api/attendee`).set(headers)
      .send({
        id: editing.id
      })
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/attendee/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toEqual(false)
      expect(res2.body.message).toBe('Attendee does not exist')
    })
  })
})
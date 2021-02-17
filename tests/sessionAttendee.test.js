const request = require('supertest')
const app = require('../app');


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


describe('SessionAttendee API', () => {
  describe('Get session attendees', () => {
    it('/api/sessionAttendee/session/{id} Should get all attendees for a session', async () => {
      let res = await agent.get('/api/sessionAttendee/session/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
    it('/api/sessionAttendee/attendee/{id} Should get all sessions for an attendee', async () => {
      let res = await agent.get('/api/sessionAttendee/attendee/5').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
    it('/api/sessionAttendee/{id} Should get one attendee information of a session', async () => {
      let res = await agent.get('/api/sessionAttendee/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      let expectedResponse = {
        id: 1,
        sessionId: 1,
        attendeeId: 5,
        rate: 76.2,
        isPresent: true,
        comment: "this is a comment",
        attendee: {
          firstName: "Alexander Levi",
          id: 5,
          lastName: "Smith Brown",
          user: {
            firstName: "Alexander Levi",
            lastName: "Smith Brown",
            username: "a_Smith225",
          },
        },
        session: {
          description: "this conference is aimed at all video game developers",
          id: 1,
          name: "dev game backend",
        },
      }
      delete(res.body.payload.attendee.user.profilePhoto) // cloudinary url is relative to env
      expect(res.body.payload).toEqual(expectedResponse)
    })
    it('/api/sessionAttendee Should not show anything', async () => {
      let res = await agent.get('/api/sessionAttendee').set(headers)
      expect(res.statusCode).toBe(404)
    })
  })

  describe('Create sesion-attendee', () => {
    it('/api/sessionAttendee/session/{id} Should add attendee to session', async () => {
      let good = {
        attendee: 1,
      };

      let res = await agent.post('/api/sessionAttendee/session/2').set(headers)
        .send(good)
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      expect(res.body.payload.attendeeId).toBe(good.attendee)
      editing = res.body.payload;
    })

    it('/api/sessionAttendee/session/{id} Should show error for missing or unvalid inputs', async () => {
      let bad = {}

      let res = await agent.post('/api/sessionAttendee/session/1').set(headers)
        .send(bad)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.attendee).toEqual('Attendee ID is required')
    })
  })

  describe('Edit comment', () => {
    it('/api/sessionAttendee/{id} Should update comment information', async () => {
      let update = {
        isPresent: true,
        rate: 50
      }

      let res = await agent.put('/api/sessionAttendee/' + editing.id).set(headers)
        .send(update)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)

      const res2 = await agent.get(`/api/sessionAttendee/${editing.id}`).set(headers)
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.rate).toBe(update.rate)
    })
    it('Should not update if you don\'t have permissions', () => { })
  })

  describe('Delete session-attendee', () => {
    it('/api/sessionAttendee/{id} Should delete attendee from session', async () => {
      let res = await agent.delete('/api/sessionAttendee/' + editing.id).set(headers).send({})
      expect(res.statusCode).toBe(200)
      expect(res.body.successful).toBe(true)

      let res2 = await agent.get('/api/sessionAttendee/' + editing.id).set(headers)

      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toBe(false)
    })
    it('Should not delete if you don\'t have permissions', () => { })
  })
})
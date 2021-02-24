const http = require('http')
const request = require('supertest')
const app = require('../app');
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

  if (res.statusCode !== 200) {
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

      expect(res.statusCode).toBe(200)
      expect(res.body.successful).toBe(true)
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })

    it('/api/attendee/{id} should show one attendee', async () => {
      const res = await agent.get('/api/attendee/3').set(headers)
      let expectedResponse = {
        successful: true,
        message: 'OK',
        payload: {
          id: 3,
          firstName: "Jeanette Susan",
          lastName: "Jenkins Steiner",
          email: "j_jenkins988@kommu.com",
          eventId: 1,
          isPresent: true,
          user: {
            firstName: "Jeanette Susan",
            lastName: "Jenkins Steiner",
            profilePhoto: 'https://res.cloudinary.com/jhia/image/upload/profile_photo_S9PPF1.png',
            username: 'j_jenkins988'
          }
        }
      }

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
    })

    it('/api/attendee/{id} should show error if the id is not valid', async () => {
      const res = await agent.get('/api/attendee/jenkins').set(headers)
      const expectedResponse = {
        successful: false,
        message: 'Attendee id is not valid',
        payload: {}
      }


      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })

  })

  describe('Create attendee', () => {
    it('/api/attendee/event/{id} should create a new attendee for event', async () => {
      const good = {
        email: 'c_victori83@kommu.com',
        isPresent: true,
        ticket: 'cbd52136-c8c8-447e-9f29-9735458e98ff'
      }

      const expectedResponse = {
        successful: true,
        message: 'Created',
        payload: {
          email: good.email,
          isPresent: good.isPresent,
          eventId: 1,
          firstName: 'Camila Victoria',
          lastName: 'Rojas Brown'
        }
      }

      const res = await agent.post('/api/attendee/event/1').set(headers).send(good)

      console.log(res.body);

      expect(res.statusCode).toBe(201)
      expect(res.body.payload).toHaveProperty('id');
      expectedResponse.payload.id = res.body.payload.id;
      editing = res.body.payload;
      expect(res.body).toEqual(expectedResponse);
    })

    it('/api/attendee/event/{id} should show error creating attendee with used tickets', async () => {
      const bad = {
        email: 'jandedoe@kommu.com',
        firstName: 'Jane',
        lastName: 'Doe',
        isPresent: true,
        ticket: 'cbd52136-c8c8-447e-9f29-9735458e98ff'
      }
      let expectedResponse = {
        successful: false,
        message: 'Ticket already used',
        payload: {}
      }
      const res = await agent.post('/api/attendee/event/1').set(headers).send(bad)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })

    it('/api/attendee/event/{id} should show error creating attendee with missing inputs', async () => {
      const bad = {}
      const expectedResponse = {
        successful: false,
        message: 'Bad Request',
        payload: {
          ticket: 'UUID is required'
        }
      }
      const res = await agent.post('/api/attendee/event/1').set(headers).send(bad)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })
  })

  describe('Update attendee', () => {
    it('/api/attendee/{id} should update attendee information', async () => {
      const update = {
        firstName: 'Ellet',
        email: 'p_ellett_89@kommu.com'
      }

      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: {
          ...editing,
          ...update,
          eventId: undefined
        }
      }

      //      delete(expectedResponse.payload.eventId)

      const res = await agent.put(`/api/attendee/${editing.id}`).set(headers).send(update)

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)

      const res2 = await agent.get(`/api/attendee/${editing.id}`).set(headers)

      expectedResponse.payload.eventId = 1;
      expectedResponse.payload.user = {
        firstName: "Camila Victoria",
        lastName: "Rojas Brown",
        profilePhoto: "https://res.cloudinary.com/jhia/image/upload/profile_photo_B23J1J.png",
        username: "c_rojas85"
      }

      expect(res2.statusCode).toBe(200)
      expect(res2.body).toEqual(expectedResponse)
    })

    it('should show error if the id is not valid', async () => {
      const expectedResponse = {
        successful: false,
        message: 'Attendee id is not valid',
        payload: {}
      }
      const res = await agent.put('/api/attendee/my-testing-event').set(headers)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })

  })

  describe('Delete attendee', () => {
    it('should delete attendee', async () => {
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: 1
      }
      const res = await agent.delete(`/api/attendee`).set(headers)
        .send({
          id: editing.id
        })

      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)

      const expectedResponse2 = {
        successful: false,
        message: 'Attendee does not exist',
        payload: {}
      }
      const res2 = await agent.get(`/api/attendee/${editing.id}`).set(headers)

      expect(res2.statusCode).toBe(404)
      expect(res2.body).toEqual(expectedResponse2)
    })
  })
})
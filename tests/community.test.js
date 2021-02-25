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

describe('Community API', () => {
  describe('Get community', () => {
    it('/api/community/search Should get all public communities', async () => {
      const res = await agent.get('/api/community/search').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
    it('/api/community/{code} Should get one community', async () => {
      let expectedResponse = {
        successful: true,
        message: 'OK',
        payload: {
          code: "KOMMMU",
          name: 'Kommu',
          prefix: 'my-kommu',
          description: "Main community",
          isPrivate: false,
          memberVerification: false,
          active: true
        }
      }

      const res = await agent.get('/api/community/KOMMMU').set(headers)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(expectedResponse)
    })
    it('Should not show private communities if not authorized', () => {
      throw new Error('Not implemented')
    })
  })

  describe('Create community', () => {
    it('/api/community Should create community', async () => {
      const good = {
        name: 'My new community',
        description: 'My new community description',
        prefix: 'my-new-community',
        isPrivate: true
      }

      const expectedResponse = {
        successful: true,
        message: 'Created',
        payload: {
          ...good,
          active: true,
          memberVerification: true
        }
      }
      
      const res = await agent.post('/api/community').set(headers).send(good)
  
      expect(res.statusCode).toBe(201)
      editing = res.body.payload;
      expectedResponse.payload.code = res.body.payload.code;
      expect(res.body).toEqual(expectedResponse)
    })
    it('/api/community Should define yourself as community owner', async () => {
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: [{
          firstName: 'Patricia Chae',
          lastName: "Ellett Meneses",
          profilePhoto: "https://res.cloudinary.com/jhia/image/upload/profile_photo_MG9KDD.png",
          username: 'p_ellett87',
          owner: true
        }]
      }
      const res = await agent.get(`/api/community/${editing.code}/user`).set(headers)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
    })
    it('/api/community Should show error for missing inputs', async () => {
      const bad = {};
      const expectedResponse = {
        successful: false,
        message: 'Bad Request',
        payload: {
          name: 'Text is required',
          description: 'Text is required',
          prefix: 'Text is required'
        }
      }
      const res = await agent.post(`/api/community`).set(headers).send(bad)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })
  })
  
  describe('Edit community', () => {
    it('/api/community/{code} Should update community information', async () => {
      const update = {
        name: 'My test2',
        description: 'My test2 description',
        active: false
      }
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: {
          ...editing,
          ...update
        }
      }
  
      const res = await agent.put(`/api/community/${editing.code}`).set(headers).send(update)
  
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
  
      const res2 = await agent.get(`/api/community/${editing.code}`).set(headers)
  
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toEqual(expectedResponse)
    })
    it('/api/community/{code} Should not update community code', async () => {
      const update = {
        code: 'TTESTT'
      }
      const expectedResponse = {
        successful: true,
        message: 'OK'
      }
  
      const res = await agent.put(`/api/community/${editing.code}`).set(headers).send(update)
  
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)

      let expectedResponse2 = {
        successful: false,
        message: 'Community does not exist',
        payload: {}
      }

      const res2 = await agent.get(`/api/community/${update.code}`).set(headers)

      expect(res2.statusCode).toEqual(404)
      expect(res2.body).toEqual(expectedResponse2)
    })
    it('/api/community/{code} Should not update if you are not the community owner', async () => {
      const update = {
        name: 'Test'
      }
      const expectedResponse = {
        successful: false,
        message: 'Unauthorized',
        payload: {}
      }
  
      const res = await agent.put(`/api/community/0JWCT2`).set(headers).send(update)
  
      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual(expectedResponse)
    })

    it('/api/community/{id} Should show error if the id does not exist', async () => {
      let expectedResponse = {
        message: "Community does not exist",
        payload: {},
        successful: false,

      }
      const res = await agent.delete('/api/community/______').set(headers)
      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual(expectedResponse)
    })
  })

  describe('Delete community', () => {
    it('/api/community/{code} Should delete community', async () => {
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: 1
      }
      const res = await agent.delete(`/api/community/${editing.code}`).set(headers)
      .send({})
      console.log(res.body)
      
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
  
      const expectedResponse2 = {
        successful: false,
        message: 'Community does not exist',
        payload: {}
      }
      const res2 = await agent.get(`/api/community/${editing.code}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body).toEqual(expectedResponse2)
    })
    it('/api/community/{code} Should not delete if you are not the community owner', async () => {
      const expectedResponse = {
        successful: false,
        message: 'Unauthorized',
        payload: {}
      }
      const res = await agent.delete('/api/community/0JWCT2').set(headers)
      .send({})
      
      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual(expectedResponse)
    })
  })
/*
  describe('Community members', () => {
    it('Should add members to community', () => {})

    it('Should approve members to private communities', () => {})

    it('Should grant access as owner to community', () => {})

    it('Should send error if id is not valid', () => {})

    it('Should not grant access to owner if you are not the community owner', () => {})
  })
*/
})
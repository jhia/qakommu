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


describe('Booth Type API', () => {

  describe('Get booth types', () => {
    it('/api/boothType/community/{id} Should show all available booths', async () => {
      const res = await agent.get('/api/boothType/community/KOMMMU').set(headers)
      expect(res.statusCode).toBe(200)
      expect(res.body.successful).toBe(true)
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('/api/boothType/{id} should show one booth', async () => {
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: {
          id: 1,
          name: "standard",
          description: "generic size",
          cost: 887.12,
          width: 10,
          height: 10,
          active: true,
        }
      };
      const res = await agent.get('/api/boothType/1').set(headers)
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
    })

    it('/api/boothType/{id} should show error if the id is not valid', async () => {
      const expectedResponse = {
        successful: false,
        message: 'Booth type id is not valid',
        payload: {}
      }
      const res = await agent.get('/api/boothType/test').set(headers)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })
  })

  describe('Create booth type', () => {
    it('should create a new booth', async () => {
      const good = {
        name: 'My new booth',
        description: 'My new booth with name and size',
        width: 1000,
        height: 800,
        cost: 10
      }

      const expectedResponse = {
        successful: true,
        message: 'Created',
        payload: {
          ...good,
          active: true
        }
      }
      
      const res = await agent.post('/api/boothType/community/KOMMMU').set(headers).send(good)
  
      expect(res.statusCode).toEqual(201)
      expectedResponse.payload.id = res.body.payload.id;
      editing = res.body.payload;
      expect(res.body).toEqual(expectedResponse);
    })

    it('should show error creating booth type if you are not the community owner', async () => {
      //throw new Error();
    })
    
    it('should show error creating booth type for missing inputs', async () => {
      const bad = {
        description: 'my new booth without name and size'
      }
      const expectedResponse = {
        successful: false,
        message: 'Bad Request',
        payload: {
          name: 'Text is required',
          width: 'Number is required',
          height: 'Number is required',
          cost: 'Number is required'
        }
      }
      const res = await agent.post('/api/boothType/community/KOMMMU').set(headers).send(bad)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })
  })

  describe('Update booth types', () => {
    it('should update booth types', async () => {
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
  
      const res = await agent.put(`/api/boothType/${editing.id}`).set(headers).send(update)
  
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
  
      const res2 = await agent.get(`/api/boothType/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toBe(200)
      expect(res2.body).toEqual(expectedResponse)
    })

    it('should show error if the id is not valid', async () => {
      const expectedResponse = {
        successful: false,
        message: 'Booth type id is not valid',
        payload: {}
      }
      const res = await agent.put('/api/boothType/my-testing-event').set(headers)
      expect(res.statusCode).toBe(400)
      expect(res.body).toEqual(expectedResponse)
    })

    it('should show error if the id does not exists', async () => {
      const res = await agent.delete('/api/boothType/200051').set(headers)
      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual({})
    })

  })

  describe('Delete booth type', () => {
    it('should delete booths', async () => {
      const expectedResponse = {
        successful: true,
        message: 'OK',
        payload: 1
      }
      const res = await agent.delete(`/api/boothType/`).set(headers)
      .send({
        id: editing.id
      })
      
      expect(res.statusCode).toBe(200)
      expect(res.body).toEqual(expectedResponse)
  
      const expectedResponse2 = {
        successful: false,
        message: 'Booth type does not exist',
        payload: {}
      }
      const res2 = await agent.get(`/api/boothType/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body).toEqual(expectedResponse2)
    })
  })
})
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


describe('Sponsor Type API', () => {

  describe('Get booth types', () => {
    it('/api/sponsorType/community/{id} Should show all available sponsor types', async () => {
      const res = await agent.get('/api/sponsorType/community/KOMMMU').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
  
    it('/api/sponsorType/{id} should show one type', async () => {
      const res = await agent.get('/api/sponsorType/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      const expectedResponse = {
        id: 1,
        name: "standard",
        description: "generic size",
        cost: 887.12,
        width: 10,
        height: 10,
        active: true,
        "communityId": 1,
      };
      expect(res.body.payload).toEqual(expectedResponse)
    })

    it('/api/sponsorType/{id} should show error if the id is not valid', async () => {
      const res = await agent.get('/api/sponsorType/test').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Sponsor type id is not valid')
    })
  })

  describe('Create sponsor type', () => {
    it('should create a new sponsor type', async () => {
      const good = {
        name: 'My new sponsor type',
        description: 'With name and size',
        width: 1000,
        height: 800,
        cost: 10
      }
      
      const res = await agent.post('/api/sponsorType/community/KOMMMU').set(headers).send(good)

      console.log(res.body)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      expect(res.body.payload).toMatchObject(good)
      expect(res.body.payload.active).toEqual(true)
      editing = res.body.payload;
    })

    it('should show error creating sponsor type if you are not the community owner', async () => {
      //throw new Error();
    })
    
    it('should show error creating sponsor type for missing inputs', async () => {
      const bad = {
        description: 'my new type without name and size'
      }
      const res = await agent.post('/api/sponsorType/community/KOMMMU').set(headers).send(bad)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Bad Request')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toEqual({
        name: 'Name is required',
        width: 'Width is required',
        height: 'Height is required',
        cost: 'Cost is required'
      })
    })
  })

  describe('Update sponsor types', () => {
    it('should update the sponsor type', async () => {
      const update = {
        name: 'My test2',
        description: 'My test2 description',
        active: false
      }
  
      const res = await agent.put(`/api/sponsorType/${editing.id}`).set(headers).send(update)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/sponsorType/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload).toMatchObject(update)
    })

    it('should show error if the id is not valid', async () => {
      const res = await agent.put('/api/sponsorType/my-testing-event').set(headers)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Sponsor type id is not valid')
    })

    it('should show error if the id does not exists', async () => {
      const res = await agent.delete('/api/sponsorType/200051').set(headers)
      expect(res.statusCode).toEqual(404)
    })

  })

  describe('Delete sponsor type', () => {
    it('should delete sponsor types', async () => {
      const res = await agent.delete(`/api/sponsorType/`).set(headers)
      .send({
        id: editing.id
      })
      
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get(`/api/sponsorType/${editing.id}`).set(headers)
  
      expect(res2.statusCode).toBe(404)
      expect(res2.body.message).toBe('Sponsor type does not exist')
    })
  })
})
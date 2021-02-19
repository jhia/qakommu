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
    it('Should get all public communities', () => {})
    it('Should get one community', () => {})
    it('Should not show private communities if not authorized', () => {})
  })

  describe('Create community', () => {
    it('Should create community', () => {})
    it('Should define yourself as community owner', () => {})
    it('Should show error for missing inputs', () => {})
  })
  
  describe('Edit community', () => {
    it('Should update community information', () => {})
    it('Should not update community code', () => {})
    it('Should not update if you are not the community owner', () => {})
  })

  describe('Delete community', () => {
    it('Should delete community', () => {})
    it('Should not delete if you are not the community owner', () => {})
  })

  describe('Community members', () => {
    it('Should add members to community', () => {})

    it('Should approve members to private communities', () => {})

    it('Should grant access as owner to community', () => {})

    it('Should send error if id is not valid', () => {})

    it('Should not grant access to owner if you are not the community owner', () => {})
  })
})
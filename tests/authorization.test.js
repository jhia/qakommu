const http = require('http');
const request = require('supertest');
const app = require('../app');

let refreshToken, server, agenr;

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

describe('Authorization Flow', () => {

  it('Should let the user login and return a refresh token', async () => {
    let res = await agent.post('/auth').set({ 'Content-Type': 'application/json' }).send({
      email: 'p_ellett87@kommu.com',
      password: '123'
    })
    expect(res.headers).toHaveProperty('set-cookie')
    let auth = res.headers['set-cookie'].find(cookie => /^Authentication/i.test(cookie))
    expect(auth).toBeDefined();
    refreshToken = auth;
  });

  it('User requests an access token using their refresh token', async () => {
    let res = await agent.post('/authorize').set('Cookie', refreshToken).send()

    expect(res.statusCode).toBe(200)
    expect(res.body.payload.hasOwnProperty('accessToken')).toBe(true)
    expect(res.body.payload.hasOwnProperty('expiresIn')).toBe(true)

    let res2 = await agent.get('/api/user').set({ 'Authorization': `Bearer ${res.body.payload.accessToken}`});
    expect(res2.statusCode).toBe(200)
    
  });

  it('User cannot access to API with their refresh token', async () => {
    let res = await agent.get('/api/user').set({ 'Authorization': `Bearer ${refreshToken.split(';')[0]}`})

    expect(res.statusCode).toBe(401)
  });

  it('User cannot access to API without token', async () => {
    let res = await agent.get('/api/user')
    expect(res.statusCode).toBe(401)
  });
  
  it('User cannot request an access token with another access token or any other thing', async () => {
    let res = await agent.post('/authorize').set('Cookie', 'Authentication=K1234')

    expect(res.statusCode).toBe(401)
  });

  it('User can logout permanently with their refresh token', async () => {
    let res = await agent.post('/auth/close').set('Cookie', refreshToken).send();
    expect(res.statusCode).toBe(200)
    let res2 = await await agent.post('/authorize').set('Cookie', refreshToken).send();
    expect(res2.statusCode).toBe(401)
  })
})
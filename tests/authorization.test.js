const request = require('supertest');
const app = require('../app');

let refreshToken;

describe('Authorization Flow', () => {

  it('Should let the user login and return a refresh token', async () => {
    let { body } = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
      email: 'p_ellett87@kommu.com',
      password: '123'
    });
    expect(typeof body.payload.refreshToken).toBe(typeof '')

    refreshToken = body.payload.refreshToken;
  });

  it('User requests an access token using their refresh token', async () => {
    let res = await request(app).post('/authorize').set({
      'Authentication': refreshToken
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.payload.hasOwnProperty('accessToken')).toBe(true)
    expect(res.body.payload.hasOwnProperty('expiresIn')).toBe(true)

    let res2 = await request(app).get('/api/user').set({ 'Authorization': `Bearer ${res.body.payload.accessToken}`});
    expect(res2.statusCode).toBe(200)
    
  });

  it('User cannot access to API with their refresh token', async () => {
    let res = await request(app).get('/api/user').set({ 'Authorization': `Bearer ${refreshToken}`})

    expect(res.statusCode).toBe(401)
  });

  it('User cannot access to API without token', async () => {
    let res = await request(app).get('/api/user')
    expect(res.statusCode).toBe(401)
  });
  
  it('User cannot request an access token with another access token or any other thing', async () => {
    let res = await request(app).post('/authorize').set({
      'Authentication': '1234'
    })

    expect(res.statusCode).toBe(401)
  });
})
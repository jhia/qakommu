const request = require('supertest')
const app = require('../app');


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

describe('Language API', () => {
  it('should show all available languages', async () => {
    const res = await agent.get('/api/language')
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    const index = res.body.payload.findIndex(lang => lang.code.toUpperCase() === 'EN')
    expect(index).not.toBe(-1)
  })

  it('should show 404 for other get endpoints', async () => {
    const res = await agent.get('/api/language/1')
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other post endpoints', async () => {
    const res = await agent.post('/api/language').send({
      code: 'zero',
      name: 'My Lang'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other update endpoints', async () => {
    const res = await agent.put('/api/language/3').send({
      name: 'zero'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other delete endpoints', async () => {
    const res = await agent.delete('/api/language').send({})
    expect(res.statusCode).toEqual(404)
  })
})

describe('Country API', () => {
  it('should show all available countries', async () => {
    const res = await agent.get('/api/country')
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    const index = res.body.payload.findIndex(country => country.alphaCode3 === 'USA')
    expect(index).not.toBe(-1)
  })

  it('should show 404 for other get endpoints', async () => {
    const res = await agent.get('/api/country/1')
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other post endpoints', async () => {
    const res = await agent.post('/api/country').send({
      code: 'zero',
      name: 'My Lang'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other update endpoints', async () => {
    const res = await agent.put('/api/country/3').send({
      name: 'zero'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other delete endpoints', async () => {
    const res = await agent.delete('/api/country').send({})
    expect(res.statusCode).toEqual(404)
  })
})

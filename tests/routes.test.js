const request = require('supertest')
const app = require('../app');

describe('Language API', () => {
  it('should show all available languages', async () => {
    const res = await request(app).get('/api/language')
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    const index = res.body.payload.findIndex(lang => lang.code.toUpperCase() === 'EN')
    expect(index).not.toBe(-1)
  })

  it('should show 404 for other get endpoints', async () => {
    const res = await request(app).get('/api/language/1')
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other post endpoints', async () => {
    const res = await request(app).post('/api/language').send({
      code: 'zero',
      name: 'My Lang'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other update endpoints', async () => {
    const res = await request(app).put('/api/language/3').send({
      name: 'zero'
    })
  })

  it('should show 404 for other delete endpoints', async () => {
    const res = await request(app).delete('/api/language');
    expect(res.statusCode).toEqual(404)
  })
})

describe('Country API', () => {
  it('should show all available countries', async () => {
    const res = await request(app).get('/api/country')
    expect(res.statusCode).toEqual(200)
    expect(res.body.successful).toEqual(true)
    expect(res.body).toHaveProperty('payload')
    expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    const index = res.body.payload.findIndex(country => country.alphaCode3 === 'USA')
    expect(index).not.toBe(-1)
  })

  it('should show 404 for other get endpoints', async () => {
    const res = await request(app).get('/api/country/1')
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other post endpoints', async () => {
    const res = await request(app).post('/api/country').send({
      code: 'zero',
      name: 'My Lang'
    })
    expect(res.statusCode).toEqual(404)
  })

  it('should show 404 for other update endpoints', async () => {
    const res = await request(app).put('/api/country/3').send({
      name: 'zero'
    })
  })

  it('should show 404 for other delete endpoints', async () => {
    const res = await request(app).delete('/api/country');
    expect(res.statusCode).toEqual(404)
  })
})

describe('register API', () => {
  it('Should send error for missing inputs', async () => {

  })

  it('Should send error for email in use', async () => {

  })

  it('Should send error for no community provided', async () => {

  })

  it('Should send email for verification', async () => {

  })

  
})
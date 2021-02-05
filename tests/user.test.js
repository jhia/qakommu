const request = require('supertest')
const app = require('../app');


let accessToken = '';
let headers = {};

let editingUser = null;

beforeAll(async () => {
  let { body: { payload } } = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
    email: 'p_ellett87@kommu.com',
    password: '123'
  });

  accessToken = payload.accessToken;

  headers = {
    'Authorization': 'Bearer ' + accessToken
  }
})


describe('User API', () => {

  describe('Get users', () => {
    it('should show my user information', async () => {
      const res = await request(app).get('/api/user').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.firstName).toBe("Kommu")
      expect(res.body.payload.username).toBe('kommu')
    })

    it('should show user information from username', async () => {
      const res = await request(app).get('/api/user/kommu').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.firstName).toBe("Kommu")
      expect(res.body.payload.username).toBe('kommu')
    })
  })

  describe('Create user', () => {
    it('Should send error for missing inputs', async () => {
      const badUser = {
        firstName: 'Jane',
        lastName: 'Doe'
      }
      const res = await request(app).post('/api/user').send(badUser)
      expect(res.statusCode).toBe(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.email).toBe('Email is required')
      expect(res.body.payload.username).toBe('Username is required')
      expect(res.body.payload.password).toBe('Password is required')
    })
  
    it('Should send error for email in use', async () => {
      const badUser = {
        firstName: 'Jane',
        email: 'p_ellett87@kommu.com'
      }
      const res = await request(app).post('/api/user').send(badUser)
      expect(res.statusCode).toBe(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.email).toBe('Email already in use')
    })
  
    it('Should send error for non valid community provided', async () => {
      const badUser = {
        firstName: 'Jane',
        lastName: 'Doe',
        community: 'K-O-M-M-U'
      }
      const res = await request(app).post('/api/user').send(badUser)
      expect(res.statusCode).toBe(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.community).toBe('Bad community provided')
    })
  
    it('Should send email for verification', async () => {
      // TODO: implementation
    })

    it('should create a new event', async () => {
      const goodEvent = {
        firstName: 'Jane',
        lastName: 'Doe',
        birthdate: '1994-01-01',
        gender: 'F',
        country: 240,
        email: 'janedoe@kommu.com',
        userame: 'janedoe',
        password: 'password123'
      }
      
      const res = await request(app).post('/api/user').set(headers).send(goodEvent)
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      delete(goodEvent.password)
      expect({
        firstName: res.body.payload.firstName,
        lastName: res.body.payload.lastName,
        birthdate: res.body.payload.birthdate,
        gender: res.body.payload.gender,
        country: res.body.payload.country,
        email: res.body.payload.email,
        username: res.body.payload.username
      }).toEqual(goodEvent)
      expect(res.body.payload).not().toHaveProperty('password')
      editingUser = res.body.payload;
    })
  })

  describe('Update user', () => {
    it('should update my user', async () => {
      const updateUser = {
        firstName: 'James',
        lastName: 'John',
        gender: 'M'
      }
  
      const res = await request(app).put('/api/user').set(headers).send(updateUser)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await request(app).get('/api/user').set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.firstName).toBe(updateUser.firstName)
      expect(res2.body.payload.lastName).toBe(updateUser.lastName)
      expect(res2.body.payload.gender).toBe(updateUser.gender)
    })

    it('should show error if trying to edit another user', async () => {
      const res = await request(app).put('/api/user/2').set(headers)
      expect(res.statusCode).toEqual(401)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Unauthorized')
    })

    it('should nout update password if trying to edit with the /api/user post', async () => {
      const badUpdate = {
        password: 'mynewpassword1'
      }
      const res = await request(app).put('/api/user/').set(headers).send(badUpdate)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)

      let res = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
        email: 'p_ellett87@kommu.com',
        password: badUpdate.password
      });

      expect(res.statusCode).toEqual(401)
      expect(res.body.successful).toEqual(false)

    })

  })

  
  
})
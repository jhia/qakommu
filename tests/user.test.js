const request = require('supertest')
const app = require('../app');


let accessToken = '';
let headers = {};

let editingUser = null;

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

beforeAll(async () => {
  let res = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
    email: 'p_ellett87@kommu.com',
    password: '123'
  });

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


describe('User API', () => {

  describe('Get users', () => {
    it('should show my user information', async () => {
      const res = await agent.get('/api/user').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.firstName).toBe("Patricia Chae")
      expect(res.body.payload.username).toBe('p_ellett87')
    })

    it('should show user information from username', async () => {
      const res = await agent.get('/api/user/kommu').set(headers)
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
      const res = await agent.post('/api/user').send(badUser)
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
      const res = await agent.post('/api/user').send(badUser)
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
      const res = await agent.post('/api/user').send(badUser)
      expect(res.statusCode).toBe(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.community).toBe('Community invitation is not valid')
    })
  
    it('Should send email for verification', async () => {
      // TODO: implementation
    })

    it('should create a new user', async () => {
      const goodEvent = {
        firstName: 'Jane',
        lastName: 'Doe',
        birthdate: '1994-01-01',
        gender: 'F',
        country: 'USA',
        occupation: 'Homeless',
        email: 'janedoe@kommu.com',
        username: 'janedoe',
        password: 'password123'
      }
      
      const res = await agent.post('/api/user').set(headers).send(goodEvent)

      if(res.statusCode !== 201) {
        console.log(res.body.payload)
      }
  
      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('Created')
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).not().toHaveProperty('password')
      const expectedResponse = {
        username: 'janedoe'
      }
      expect(res.body.payload).toEqual(expectedResponse)
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
  
      const res = await agent.put('/api/user').set(headers).send(updateUser)
  
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body.message).toBe('OK')
  
      const res2 = await agent.get('/api/user').set(headers)
  
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.firstName).toBe(updateUser.firstName)
      expect(res2.body.payload.lastName).toBe(updateUser.lastName)
      expect(res2.body.payload.gender).toBe(updateUser.gender)
    })

    it('should show error if trying to edit another user', async () => {
      const res = await agent.put('/api/user/2').set(headers)
      expect(res.statusCode).toEqual(401)
      expect(res.body.successful).toEqual(false)
      expect(res.body.message).toBe('Unauthorized')
    })

    it('should not update password if trying to edit with the /api/user post', async () => {
      const badUpdate = {
        password: 'mynewpassword1'
      }
      const res = await agent.put('/api/user/').set(headers).send(badUpdate)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)

      let res2 = await agent.post('/auth').set({ 'Content-Type': 'application/json' }).send({
        email: 'p_ellett87@kommu.com',
        password: badUpdate.password
      });

      expect(res2.statusCode).toEqual(401)
      expect(res2.body.successful).toEqual(false)

    })

  })

  
  
})
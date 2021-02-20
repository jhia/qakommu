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



describe('Ticket API', () => {
  describe('Get tickets', () => {
    it('/api/ticket/event/2 Should get all tickets for an event', async () => {
      let res = await agent.get('/api/ticket/event/2').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
    it('/api/ticket/1 Should get one ticket', async () => {
      let res = await agent.get('/api/ticket/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      let expectedResponse = {
        id: 1,
        name: "Early Bird",
        description: "With Early Bird you have the opportunity to get the tickets with the lowest price",
        isDraft: false,
        eventId: 1,
        basePrice: 120,
        quantityTotal: 100,
        quantityCurrent: 100,
        reserved: 5,
        reservedCurrent: 5,
        limitSale: true,
        maxTicketSale: 5,
        start: "2020-05-05T00:00:00.000Z",
        end: "2020-05-15T00:00:00.000Z",
        prices: {
          price1: {
            active: false
          },
          price2: {
            active: false
          },
          price3: {
            active: false
          },
          price4: {
            active: false
          },
        }

      }
      expect(res.body.payload).toEqual(expectedResponse)
    })
    it('/api/ticket Should not show tickets', async () => {
      let res = await agent.get('/api/ticket').set(headers)
      expect(res.statusCode).toBe(404)
    })
  })

  describe('Create ticket', () => {
    it('/api/ticket/event/{id} Should create ticket', async () => {
      let goodTicket = {
        name: "New Early Bird",
        description: "With Early Bird you have the opportunity to get the tickets with the lowest price",
        isDraft: true,
        basePrice: 20,
        quantityTotal: 200,
        reserved: 10,
        limitSale: true,
        maxTicketSale: 10,
        start: "2020-11-01",
        end: "2021-01-30"
      }
      let res = await agent.post('/api/ticket/event/2').set(headers)
        .send(goodTicket)
      if(res.statusCode !== 200) {
        console.log(res.body.payload)
      }
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      editing = {
        ...goodTicket,
        ...res.body.payload
      };
    })
    it('/api/ticket/event/{id} Should show error for missing or unvalid inputs', async () => {
      let badTicket = {
        name: '#1245',
        description: null,
        reserved: -20,
        basePrice: -10
      }

      let res = await agent.post('/api/ticket/event/2').set(headers)
        .send(badTicket)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.description).toEqual('Description is required')
      expect(res.body.payload.reserved).toEqual('Reserved is not valid')
      expect(res.body.payload.basePrice).toEqual('Base price is not valid')
    })
  })

  describe('Edit ticket', () => {
    it('/api/ticket/{id} Should update information', async () => {
      let update = {
        name: 'newest ticket',
        description: 'the newest ticket to buy'
      }

      let res = await agent.put('/api/ticket/' + editing.id).set(headers)
        .send(update)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)

      const res2 = await agent.get(`/api/ticket/${editing.id}`).set(headers)
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body.message).toBe('OK')
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.name).toBe(update.name)
      expect(res2.body.payload.description).toBe(update.description)
    })
    it('Should not update id', async () => {
      let update = {
        id: 25001,
        description: 'my new description'
      }

      let res = await agent.put('/api/ticket/' + editing.id).set(headers)
        .send(update)
      expect(res.statusCode).toEqual(200)

      const res2 = await agent.get('/api/ticket/' + update.id).set(headers)

      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toBe(false)
    })
    it('Should not update if you don\'t have permissions', () => { })
  })

  describe('Delete ticket', () => {
    it('/api/ticket/{id} Should delete ticket', async () => {
      let res = await agent.delete('/api/ticket/' + editing.id).set(headers).send({})
      expect(res.statusCode).toBe(200)
      expect(res.body.successful).toBe(true)

      let res2 = await agent.get('/api/ticket/' + editing.id).set(headers)

      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toBe(false)
    })
    it('Should not delete if you don\'t have permissions', () => { })
  })
})
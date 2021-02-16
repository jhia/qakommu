const request = require('supertest')
const app = require('../app');


let accessToken = '';
let headers = {};

let editing = null;

beforeAll(async () => {
  let res = await request(app).post('/auth').set({ 'Content-Type': 'application/json' }).send({
    email: 'p_ellett87@kommu.com',
    password: '123'
  });

  if (res.statusCode !== 200) {
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
  describe('Get tickets sales', () => {
    it('/api/ticketSale/ticket/{id} Should get all tickets sales for a ticket', async () => {
      let res = await request(app).get('/api/ticketSale/ticket/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.length).toBeGreaterThanOrEqual(1)
    })
    it('/api/ticketSale/{id} Should get one ticket sale information', async () => {
      let res = await request(app).get('/api/ticketSale/1').set(headers)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      let expectedResponse = {
        id: 1,
        count: 1,
        unitAmount: 150,
        totalAmount: 150,
        totalAmountPaid: 150,
        priceType: "PB",
        ticketId: 1,
        userId: 2,
        ticket: {
          id: 1,
          name: "Early Bird",
          description: "With Early Bird you have the opportunity to get the tickets with the lowest price",
        },
        details: [{
          deactivated: false,
          uuid: "cbd52136-c8c8-447e-9f29-9735458e98ff"
        }],
        user: {
          firstName: "Shelly Eileen",
          lastName: "Wimbley Bateman",
          profilePhoto: "profile_photo_MOK123.png",
          username: "s_wimbley84"
        }
      }
      expect(res.body.payload).toEqual(expectedResponse)
    })
    it('/api/ticketSale Should not show tickets', async () => {
      let res = await request(app).get('/api/ticketSale').set(headers)
      expect(res.statusCode).toBe(404)
    })
  })

  describe('Create sale', () => {
    it('/api/ticketSale/ticket/{id} Should create ticket sale', async () => {
      let res0 = await request(app).get('/api/ticket/1').set(headers)
      expect(res0.statusCode).toEqual(200)

      let availableTickets = res0.body.payload.quantityCurrent
      let goodTicket = {
        count: 2,
        totalAmountPaid: 240
      };

      let res = await request(app).post('/api/ticketSale/ticket/1').set(headers)
        .send(goodTicket)

      expect(res.statusCode).toEqual(201)
      expect(res.body.successful).toEqual(true)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload).toHaveProperty('id')
      expect(res.body.payload.count).toBe(goodTicket.count)
      expect(res.body.payload.totalAmountPaid).toBe(goodTicket.totalAmountPaid)
      expect(res.body.payload.totalAmount).toBe(res0.body.payload.basePrice * goodTicket.count)
      editing = {
        ...goodTicket,
        ...res.body.payload
      };

      let res2 = await request(app).get('/api/ticket/1').set(headers)
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.payload.quantityCurrent).toBe(availableTickets - goodTicket.count)

    })
    it('/api/ticketSale/ticket/{id} Should show error for missing or unvalid inputs', async () => {
      let badTicket = {
        count: -20,
      }

      let res = await request(app).post('/api/ticketSale/ticket/1').set(headers)
        .send(badTicket)
      expect(res.statusCode).toEqual(400)
      expect(res.body.successful).toEqual(false)
      expect(res.body).toHaveProperty('payload')
      expect(res.body.payload.count).toEqual('Count is not a valid number')
      expect(res.body.payload.totalAmountPaid).toEqual('Amount is not valid')
    })
  })

  describe('Edit ticket', () => {
    it('/api/ticket/{id} Should update user information', async () => {
      let update = {
        username: 'kommu'
      }

      let res = await request(app).put('/api/ticketSale/' + editing.id).set(headers)
        .send(update)
      expect(res.statusCode).toEqual(200)
      expect(res.body.successful).toEqual(true)

      const res2 = await request(app).get(`/api/ticketSale/${editing.id}`).set(headers)
      expect(res2.statusCode).toEqual(200)
      expect(res2.body.successful).toEqual(true)
      expect(res2.body).toHaveProperty('payload')
      expect(res2.body.payload.user.username).toBe(update.username)
    })
    it('Should not update if you don\'t have permissions', () => { })
  })

  describe('Delete ticket', () => {
    it('/api/ticket/{id} Should delete ticket', async () => {
      let res = await request(app).delete('/api/ticketSale/' + editing.id).set(headers).send({})
      expect(res.statusCode).toBe(200)
      expect(res.body.successful).toBe(true)

      let res2 = await request(app).get('/api/ticketSale/' + editing.id).set(headers)

      expect(res2.statusCode).toBe(404)
      expect(res2.body.successful).toBe(false)
    })
    it('Should not delete if you don\'t have permissions', () => { })
  })
})
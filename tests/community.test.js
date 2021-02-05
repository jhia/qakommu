const request = require('supertest')
const app = require('../app');


let accessToken = '';
let headers = {};

let editingCommunity = null;

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

describe('')
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
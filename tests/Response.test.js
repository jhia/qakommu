const Response = require('../http/response');
const ResponseError = require('../http/error');

function mockupResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  }
}

describe('http/Response', () => {

  it('Should send response format', () => {
    let expectedResponse = {
      message: "OK",
      successful: true,
      payload: {
        test: 'my test'
      }
    }

    let res = mockupResponse();

    (new Response(res)).send({ test: 'my test' })

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
  
  it('Should call from to get a quick response', () => {
    expect(Response.hasOwnProperty('from')).toBe(true);
  })

  it('Objects from class should inherits class', () => {
    let res = mockupResponse();
    expect(new Response(res)).toBeInstanceOf(Response);
    expect(Response.from(res)).toBeInstanceOf(Response);
  });

  it('Should send error', () => {
    let expectedResponse = {
      message: 'Bad email!',
      successful: false,
      payload: {}
    }

    let error = new ResponseError(400, 'Bad email!');
    let res = mockupResponse();

    Response.from(res).send(error);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  })
})
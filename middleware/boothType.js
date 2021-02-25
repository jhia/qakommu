const { boothType:BoothType } = require('../models')
const { Response, ResponseError } = require('../http')

exports.boothTypeVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Booth type does not exist')
  const { boothTypeId } = req.params;

  if(isNaN(boothTypeId)) {
    const validationError = new ResponseError(400, 'Booth type id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const boothType = await BoothType.findByPk(boothTypeId, {
      attributes: ['id']
    })
    if(!boothType) {
      return Response.from(res).send(notFoundError)
    }
    req.boothType = boothType;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
const { room:Room } = require('../models')
const { Response, ResponseError } = require('../http')

exports.roomVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Room does not exist')
  const { roomId } = req.params;

  if(isNaN(roomId)) {
    const validationError = new ResponseError(400, 'Room id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const room = await Room.findByPk(roomId, {
      attributes: ['id']
    })
    if(!room) {
      return Response.from(res).send(notFoundError)
    }
    req.room = room;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
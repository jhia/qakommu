const { event:Event } = require('../models')
const { Response, ResponseError } = require('../http')

exports.eventVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Event does not exist')
  const { eventId } = req.params;

  if(isNaN(eventId)) {
    const validationError = new ResponseError(400, 'Event id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const event = await Event.findByPk(eventId, {
      attributes: ['id']
    })
    if(!event) {
      return Response.from(res).send(notFoundError)
    }
    req.event = event;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
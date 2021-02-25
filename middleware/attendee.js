const { attendee:Attendee } = require('../models')
const { Response, ResponseError } = require('../http')

exports.attendeeVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Attendee does not exist')
  const { attendeeId } = req.params;

  if(isNaN(attendeeId)) {
    const validationError = new ResponseError(400, 'Attendee id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const attendee = await Attendee.findByPk(attendeeId, {
      attributes: ['id']
    })
    if(!attendee) {
      return Response.from(res).send(notFoundError)
    }
    req.attendee = attendee;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}

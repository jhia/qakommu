const { session:Session, sessionAttendee:SessionAttendee } = require('../models')
const { Response, ResponseError } = require('../http')

exports.sessionVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Session does not exist')
  const { sessionId } = req.params;

  if(isNaN(sessionId)) {
    const validationError = new ResponseError(400, 'Session id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const session = await Session.findByPk(sessionId, {
      attributes: ['id']
    })
    if(!session) {
      return Response.from(res).send(notFoundError)
    }
    req.session = session;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}

exports.sessionAttendeeVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Session attendee does not exist')
  const { sessionAttendeeId } = req.params;

  if(isNaN(sessionAttendeeId)) {
    const validationError = new ResponseError(400, 'Session attendee id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const sa = await SessionAttendee.findByPk(sessionAttendeeId, {
      attributes: ['id', 'isPresent']
    })
    if(!sa) {
      return Response.from(res).send(notFoundError)
    }
    req.sessionAttendee = sa;
    return next();
  } catch(err) {
    return Response.from(res).send(notFoundError)
  }
}
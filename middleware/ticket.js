const { ticket:Ticket } = require('../models')
const { Response, ResponseError } = require('../http')

exports.eventVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Event does not exist')
  const { ticketId } = req.params;

  if(isNaN(ticketId)) {
    const validationError = new ResponseError(400, 'Ticket id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const ticket = await Ticket.findByPk(ticketId, {
      attributes: ['id']
    })
    if(!ticket) {
      return Response.from(res).send(notFoundError)
    }
    req.ticket = ticket;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
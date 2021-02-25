const { ticket:Ticket, ticketSale:TicketSale, ticketSaleDetail:TicketSaleDetail } = require('../models')
const { Response, ResponseError } = require('../http')

exports.ticketVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Ticket does not exist')
  const { ticketId } = req.params;

  if(isNaN(ticketId)) {
    const validationError = new ResponseError(400, 'Ticket id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const ticket = await Ticket.findByPk(ticketId)
    if(!ticket) {
      return Response.from(res).send(notFoundError)
    }
    req.ticket = ticket;
    next();
  } catch(err) {
    return Response.from(res).send(notFoundError)
  }
}

exports.ticketSaleVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Ticket sale does not exist')
  const { ticketSaleId } = req.params;

  if(isNaN(ticketSaleId)) {
    const validationError = new ResponseError(400, 'Ticket sale id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const sale = await TicketSale.findByPk(ticketSaleId, {
      attributes: ['id', 'count']
    })
    if(!sale) {
      return Response.from(res).send(notFoundError)
    }
    req.ticketSale = sale;
    next();
  } catch(err) {
    return Response.from(res).send(notFoundError)
  }
}

exports.ticketSaleDetailUUIDVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Ticket does not exist')
  const { ticketSaleDetailUUID } = req.params;

  if(!ticketSaleDetailUUID || typeof ticketSaleDetailUUID !== typeof '' || ticketSaleDetailUUID.length < 36) {
    const validationError = new ResponseError(400, 'Ticket uuid is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const tsd = await TicketSaleDetail.findByUUID(ticketSaleDetailUUID, {
      attributes: ['id', 'deactivated']
    });
    if(!tsd) {
      return Response.from(res).send(notFoundError)
    }
    req.ticketSaleDetail = tsd;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
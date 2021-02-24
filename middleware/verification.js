const DB = require('../models')
const { Response, ResponseError } = require('../http');
const { validatePositiveInteger, validateUUID } = require('../helpers/validations');

const modelIdVerification = ({ module, name, param=null, attributes=['id'], idName = 'id', isPk='true', validation = validatePositiveInteger }) => async (req, res, next) => {
  if(!param) {
    param = `${module}Id`;
  }
  const validationError = new ResponseError(400, `${name} id is not valid`)
  const notFoundError = new ResponseError(404, `${name} does not exist`)
  const matchValue = req.params[param];
  try {
    if(validation === validatePositiveInteger ?
      !validation(parseInt(matchValue)) : // validate as integer
      !validation(matchValue)) { // validate as it is (string)
        throw new Error('Not valid');
    }
  } catch {
    return Response.from(res).send(validationError);
  }
  
  try {
    let item;

    if(idName !== 'id' || !isPk) {
      item = await DB[module].findOne({
        where: { [idName]: matchValue },
        attributes
      });
    } else {
      item = await DB[module].findByPk(matchValue, {
        attributes
      })
    }
    if(!item) {
      return Response.from(res).send(notFoundError)
    }
    req[module] = item;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}

exports.attendeeVerification = modelIdVerification({ module: 'attendee', name: 'Attendee' }); // default param : attendeeId

exports.boothTypeVerification = modelIdVerification({ module: 'boothType', name: 'Booth type' });

exports.communityCodeVerification = modelIdVerification({
  module: 'community',
  name: 'Community',
  param: 'communityCode',
  idName: 'code',
  isPk: false,
  attributes: ['id', 'code'],
  validation: (v) => typeof v === typeof '' &&  v.length === 6,
});

exports.eventVerification = modelIdVerification({ module: 'event', name: 'Event', attributes: ['id', 'image'] });

exports.exhibitorVerification = modelIdVerification({ module: 'exhibitor', name: 'Exhibitor' });

exports.roomVerification = modelIdVerification({ module: 'room', name: 'Room' });

exports.sessionVerification = modelIdVerification({ module: 'session', name: 'Session' });

exports.sessionAttendeeVerification = modelIdVerification({ module: 'sessionAttendee', name: 'Session attendee', attributes: ['id', 'isPresent'] })

exports.sponsorTypeVerification = modelIdVerification({ module: 'sponsorType', name: 'Sponsor type' });

exports.ticketVerification = modelIdVerification({ module: 'ticket', name: 'Ticket', attributes: undefined });

exports.ticketSaleVerification = modelIdVerification({ module: 'ticketSale', name: 'Ticket sale', attributes: ['id', 'count'] });

exports.ticketSaleDetailUUIDVerification = modelIdVerification({
  module: 'ticketSaleDetail',
  name: 'Ticket',
  param: 'ticketSaleDetailUUID',
  idName: 'uuid',
  isPk: false,
  validation: validateUUID,
  attributes: ['id', 'deactivated']
});
const { exhibitor:Exhibitor } = require('../models')
const { Response, ResponseError } = require('../http')

exports.exhibitorVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Exhibitor does not exist')
  const { exhibitorId } = req.params;

  if(isNaN(exhibitorId)) {
    const validationError = new ResponseError(400, 'Exhibitor id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const exhibitor = await Exhibitor.findByPk(exhibitorId, {
      attributes: ['id']
    })
    if(!exhibitor) {
      return Response.from(res).send(notFoundError)
    }
    req.exhibitor = exhibitor;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
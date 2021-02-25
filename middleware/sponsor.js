const { sponsor:Sponsor } = require('../models')
const { Response, ResponseError } = require('../http')

exports.sponsorVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Sponsor does not exist')
  const { sponsorId } = req.params;

  if(isNaN(sponsorId)) {
    const validationError = new ResponseError(400, 'Sponsor id is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const sponsor = await Sponsor.findByPk(sponsorId, {
      attributes: ['id', 'image']
    })
    if(!sponsor) {
      return Response.from(res).send(notFoundError)
    }
    req.sponsor = sponsor;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
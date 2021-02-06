const { userCommunity: UserCommunity, community: Community } = require('../models')
const { Response, ResponseError } = require('../http')

exports.communityOwner = async function (req, res, next) {
  const authorizationError = new ResponseError(401)

  try {
    let permission = await UserCommunity.findOne({
      where: {
        userId: req.user.id,
        communityId: req.params.id,
        owner: true
      }
    })

    if(!!permission) {
      req.userCommunity = permission;
      return next();
    }

    return Response.from(res).send(authorizationError)
  } catch {
    return Response.from(res).send(authorizationError)
  }
}

exports.communityCodeVerification = async function(req, res, next) {
  const notFoundError = new ResponseError(404, 'Community does not exist')
  const { communityCode } = req.params;

  if(!communityCode || communityCode.length < 6) {
    const validationError = new ResponseError(400, 'Community code is not valid')
    return Response.from(res).send(validationError)
  }
  
  try {
    const community = await Community.findByCode(communityCode, {
      attributes: ['id']
    });
    if(!community) {
      return Response.from(res).send(notFoundError)
    }
    req.community = community;
    return next();
  } catch {
    return Response.from(res).send(notFoundError)
  }
}
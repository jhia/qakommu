const DB = require('../models')
const { Response, ResponseError } = require('../http');

exports.communityOwner = async function (req, res, next) {
  const authorizationError = new ResponseError(401)

  try {
    let permission = await DB.userCommunity.findOne({
      where: {
        userId: req.user.id,
        communityId: req.community.id,
        owner: true
      }
    })

    if(!permission) {
      return Response.from(res).send(authorizationError);
    }

    req.userCommunity = permission;
    next();
  } catch {
    return Response.from(res).send(authorizationError)
  }
}
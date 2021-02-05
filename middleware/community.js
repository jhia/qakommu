const { userCommunity: UserCommunity } = require('../models')
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
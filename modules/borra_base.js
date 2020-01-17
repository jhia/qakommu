'use strict'

const setupDatabase = require('../lib/db')
/* ------------------------------------------------------------------------------------------- */
const setupUserModel = require('./user/user.model')
const setupRolesModel = require('./roles/roles.model')


/* ------------------------------------------------------------------------------------------- */


module.exports = async function (config) {

    const sequelize = setupDatabase(config)
    const UserModel = setupRolesModel(config)
    const RolesModel = setupUserModel(config)

    UserModel.hasOne(RolesModel)
    RolesModel.belongsTo(UserModel)

    await sequelize.authenticate()
    await sequelize.sync({ force: true })
}

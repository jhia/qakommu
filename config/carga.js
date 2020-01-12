const setupDatabase = require('./db')
const repository = require('../modules/repository/repository.model')
const defaults = require('defaults')

module.exports = async function (config) {

  config = defaults(config,{
    database: process.env.DB_NAME || 'kommu',
    username: process.env.DB_USER || 'kommu',
    password: process.env.DB_PASS || 'kommu_password',        
    host: process.env.DB_HOST || 'kommu_db',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  })

  const sequelize = setupDatabase(config)
  const repositoryModel = repository(config)
  
  await sequelize.authenticate()



  if (config.setup) {
    await sequelize.sync({force: true})
  }
}  
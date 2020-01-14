'use strict'
const Sequelize = require('sequelize')

module.exports = (sequelize, type) => {
    return sequelize.define('repository', {
        username: {
          type: Sequelize.STRING,
          allowNull: false
        }
    })
}
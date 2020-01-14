'use strict'
const Sequelize = require('sequelize')

module.exports = (sequelize, type) => {
    return sequelize.define('attendee', {
        username: {
          type: Sequelize.STRING,
          allowNull: false
        }
    })
}
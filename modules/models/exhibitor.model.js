'use strict'
const Sequelize = require('sequelize')

module.exports = (sequelize, type) => {
    return sequelize.define('exhibitor', {
        username: {
          type: Sequelize.STRING,
          allowNull: false
        }
    })
}
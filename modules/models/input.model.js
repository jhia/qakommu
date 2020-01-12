'use strict'
const Sequelize = require('sequelize')

module.exports = (sequelize, type) => {
    return sequelize.define('input', {
        username: {
          type: Sequelize.STRING,
          allowNull: false
        }
    })
}
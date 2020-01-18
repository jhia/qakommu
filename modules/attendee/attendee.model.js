'use strict'

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('attendee', {
        username: {
          type: DataTypes.STRING,
          allowNull: false
        }
    })
}
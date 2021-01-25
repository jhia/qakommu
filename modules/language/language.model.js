'use strict'
const Model = require('sequelize').Model;

module.exports = (sequelize, DataTypes) => {
  const Language = sequelize.define('language', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    timestamps: false,
    tableName: 'languages',
  })

  Language.associates = (models) => {

  }
  
  return Language;
}
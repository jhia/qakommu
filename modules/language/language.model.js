'use strict'
const Model = require('sequelize').Model;

module.exports = (sequelize, DataTypes) => {
  class Language extends Model {}
  Language.init({
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
    sequelize,
    modelName: 'Language',
    tableName: 'languages',
  })

  return Language;
}
'use strict'

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

  Language.findByCode = function (code) {
    if(!code) {
        throw new Error('Language code is required')
    }
    return this.findOne({
        where: {
            code
        }
    })
  }
  
  return Language;
}
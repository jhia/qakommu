'use strict';

module.exports = (sequelize, DataTypes) => {
  const community = sequelize.define('community', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
          args: true,
          msg: 'this name already exists!'
      }
    },
    description: DataTypes.STRING,
    id_type_of_account: DataTypes.INTEGER,
    user_acount: DataTypes.INTEGER,
    web: DataTypes.STRING,
    prefix: DataTypes.STRING,
    member_verification: DataTypes.BOOLEAN,
    id_repository: DataTypes.INTEGER,
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      unique: {
          args: true,
          msg: 'this code already exists!'
      }
    },
  });
  
  community.associate = function(models) {
    // associations can be defined here
    community.hasMany(models.user_type, {
      foreignKey: 'id_community',
      as: 'user_types'
    });
  };

  return community;
};
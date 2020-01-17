'use sctrict'
const Sequelize = require('sequelize')
//const setupDatabase = require('../../lib/db')

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true
    },
    gender: DataTypes.STRING,
    repositoryId: DataTypes.INTEGER,
    last_login: DataTypes.DATE
    }

  );


  Users.associate = function(models) {
    Users.belongsTo(models.Roles, {
      through: 'Roles',
      foreignKey: 'id',
      as: 'Roles'
    });
  };
  
  return Users;
};
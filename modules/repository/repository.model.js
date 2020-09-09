'use strict'

module.exports = (sequelize, DataTypes) => {
  const repository = sequelize.define('repository', {
    name: DataTypes.TEXT,
    location: DataTypes.TEXT,
    id_community: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
  });

  repository.associate = function (models) {
    repository.belongsTo(models.community, {
      foreignKey: 'id_community',
      as: 'community'
    });
  }

  return repository;
}

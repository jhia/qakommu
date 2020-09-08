'use strict'

module.exports = (sequelize, DataTypes) => {
  const repository_object = sequelize.define('repository_object', {

    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    id_user: DataTypes.INTEGER,        
    id_repository: DataTypes.INTEGER,        
    id_object_type: DataTypes.INTEGER,        
    size: DataTypes.INTEGER,        
    privated: DataTypes.BOOLEAN,        
    active: DataTypes.BOOLEAN,        

  });

  repository_object.associate = function(models){
    repository_object.belongsTo(models.user, {
      foreignKey: 'id_user',
      as: 'user'
    });

    repository_object.belongsTo(models.repository, {
      foreignKey: 'id_repository',
      as: 'repository'
    });

    repository_object.belongsTo(models.object_type, {
      foreignKey: 'id_object_type',
      as: 'object_type'
    });



  }

  return repository_object;
}

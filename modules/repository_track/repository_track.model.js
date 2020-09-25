'use strict'

module.exports = (sequelize, DataTypes) => {
  const repository_track = sequelize.define('repository_track', {

    id_track: DataTypes.INTEGER, 
    id_repository_object: DataTypes.INTEGER, 

  });

  repository_track.associate = function(models){
    //To create model associations
  }

  return repository_track;
}

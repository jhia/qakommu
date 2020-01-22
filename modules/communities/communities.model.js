'use strict';
module.exports = (sequelize, DataTypes) => {
  const communities = sequelize.define('communities', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    typeofacountId: DataTypes.INTEGER,
    userAcout: DataTypes.INTEGER,

    web: DataTypes.STRING,
    prefix: DataTypes.STRING,
    member_verification: DataTypes.BOOLEAN,
    repositoryId: DataTypes.INTEGER
  });


/* 
Communities.associate = function(models) {
    // associations can be defined here pendiente
    Communities.belongsToMany(models.Users, {
      through: 'UsersCommunities',
      foreignKey: 'communityId'
    });

    Communities.belongsToMany(models.Permissions, {
      through: 'PermissionsRoles',
      foreignKey: 'communityId',
      as: 'permissions'
    });
}
 */


  return communities;
};
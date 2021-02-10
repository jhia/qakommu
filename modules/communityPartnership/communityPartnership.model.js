'use strict';

module.exports = function (sequelize, DataTypes) {
  const CommunityPartnership = sequelize.define('communityPartnership', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    communityId: {
      field: 'id_community',
      allowNull: false,
      type: DataTypes.INTEGER
    },
    partnershipId: {
      field: 'id_partnership',
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'community_partnerships'
  });

  CommunityPartnership.associate = function (models) {
    CommunityPartnership.belongsTo(models.community, {
      foreignKey: 'id_community',
      as: 'community'
    })

    CommunityPartnership.belongsTo(models.partnership, {
      foreignKey: 'id_partnership',
      as: 'partner'
    })
  }

  return CommunityPartnership;
}
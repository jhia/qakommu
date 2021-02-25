'use strict'

module.exports = (sequelize, DataTypes) => {
  const EventTeam = sequelize.define('eventTeam', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'id_user'
    },
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'id_event'
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'event_team'
  })

  EventTeam.associate = function (models) {

    EventTeam.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'id_user'
    })

    EventTeam.belongsTo(models.event, {
      as: 'event',
      foreignKey: 'id_event'
    })
  }

  return EventTeam;
}
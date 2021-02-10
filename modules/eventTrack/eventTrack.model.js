'use strict'

module.exports = function (sequelize, DataTypes) {
  const EventTrack = sequelize.define('eventTrack', {
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'id_event'
    },
    trackId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'id_track'
    },
  }, {
    tableName: 'event_tracks'
  })

  EventTrack.associate = function (models) {

    EventTrack.belongsTo(models.track, {
      as: 'track',
      foreignKey: 'id_track'
    })

    EventTrack.belongsTo(models.event, {
      as: 'event',
      foreignKey: 'id_event'
    })
  }

  return EventTrack
}
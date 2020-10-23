'use strict'

module.exports = (sequelize, DataTypes) => {
    const track = sequelize.define('track', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        id_module_name: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color:{
            type: DataTypes.TEXT
        }
    });

    track.associate = function (models) {
        track.hasMany(models.track_post, {
            foreignKey: 'id_track',
            as: 'track_posts'
        });

        //track to session
        track.hasMany(models.track_session, {
            foreignKey: 'id_track',
            as: 'track_track_session'
        });

        // track to module
        track.belongsTo(models.module_name, {
            foreignKey: 'id_module_name',
            as: 'module_name'
        });

    }

    return track;
}
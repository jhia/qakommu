'use strict'

module.exports = (sequelize, DataTypes) => {
    const Track = sequelize.define('track', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        communityId: {
            field: 'id_community',
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        icon: Sequelize.STRING,
        hidden: {
            field: 'hidden',
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        timestamps: false,
        tableName: 'tracks'
    });

    Track.associate = function (models) {
        /*track.hasMany(models.track_post, {
            foreignKey: 'id_track',
            as: 'track_posts'
        });

        //track to session
        track.hasMany(models.track_session, {
            foreignKey: 'id_track',
            as: 'track_track_session'
        });*/

        // track to module
        Track.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

    }

    Track.findByCommunity = function (communityId, options={}) {
        return this.findAll({
            where: {
                communityId,
                active: true,
                hidden: false
            },
            attributes: ['id', 'name', 'description', 'icon'],
            ...options
        })
    }

    return track;
}
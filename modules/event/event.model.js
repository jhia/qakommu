'use strict'

module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('event', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            allowNull: false,
            type: DataTypes.ENUM('c', 'w', 'm')
        },
        communityId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_community'
        },
        online: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        noCfp:{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'no_cfp'
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'url_code'
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_private'
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        promRate: {
            type: DataTypes.FLOAT,
            defaultValue: 5.0,
            field: 'prom_rate'
        },
        image: {
            type: DataTypes.STRING
        },
        primary_color: DataTypes.STRING,
        secondary_color: DataTypes.STRING,
    }, {
        tableName: 'events'
    });

    Event.associate = function(models){
        //To create model associations

        //event to community
        Event.belongsTo(models.community, {
            foreignKey: 'community_id',
            as: 'community'
        });

        //event to sponsor
        /*event.hasMany(models.sponsor, {
            foreignKey: 'id_event',
            as: 'event_sponsor'
        });
        
        //event to exhibitor
        event.hasMany(models.exhibitor, {
            foreignKey: 'id_event',
            as: 'event_exhibitor'
        });

        //event to ticket
        event.hasMany(models.ticket, {
            foreignKey: 'id_event',
            as: 'event_ticket'
        });

        //event to speaker
        event.hasMany(models.coupon, {
            foreignKey: 'id_event',
            as: 'event_coupon'
        });

        //event to speaker
        event.hasMany(models.speaker, {
            foreignKey: 'id_event',
            as: 'event_speaker'
        });*/
    }

    Event.validateName = function(value) {
        if(!value) {
            throw new Error('Name is required')
        }
        return typeof value === typeof '' && value.length >= 3;
    }

    Event.validateDescription = function (value) {
        if(!value) {
            throw new Error('Decription is required')
        }
        return typeof value === typeof '' && value.length > 3;
    }

    Event.validateType = function (value) {
        if(!value) {
            throw new Error('Type is required')
        }
        return ['c', 'w', 'm'].includes(value);
    }

    Event.validateUrl = function(value) {
        if(!value) {
            throw new Error('URL is required');
        }
        let regex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

        return regex.text(value)
    }

    return Event;
}
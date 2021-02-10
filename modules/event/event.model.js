'use strict'

const { userCommunity:UserCommunity, eventTeam:EventTeam } = require('../../models')

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    id: {
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
    primaryColor: {
      field: 'primary_color',
      type: DataTypes.STRING,
    },
    secondaryColor: {
      field: 'secondary_color',
      type: DataTypes.STRING,
    }
    }, {
      tableName: 'events'
  });

  Event.associate = function(models){
    //To create model associations

    //event to community
    Event.belongsTo(models.community, {
        foreignKey: 'id_community',
        as: 'community'
    });

    Event.belongsToMany(models.user, {
      as: 'team',
      through: "event_team",
      foreignKey: "id_event",
      otherKey: "id_user"
    })

    Event.belongsToMany(models.track, {
      as: 'tracks',
      through: 'event_tracks',
      foreignKey: 'id_event',
      otherKey: 'id_track'
    })

    //event to sponsor
    Event.hasMany(models.sponsor, {
      foreignKey: 'id_event',
      as: 'sponsors'
    });
    
    //event to exhibitor
    Event.hasMany(models.exhibitor, {
      foreignKey: 'id_event',
      as: 'exhibitors'
    });
/*
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

  Event.exists = async function (id) {
		if(!id) {
			throw new Error('Event ID is required')
		}
		const event = await this.findByPk(id, { attributes: ['id'] })
		return !!event;
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

    return regex.test(value)
  }

  Event.prototype.canEditEvent = async function(userId) {
    const owner = await UserCommunity.findOne({
      where: {
        userId,
        owner: true
      },
      attributes: ['id']
    });

    if(owner) return true;

    const assistant = await EventTeam.findOne({
      where: {
        userId,
        eventId: this.id,
        active: true
      },
      attributes: ['id']
    })

    return !!assistant;
  }

    return Event;
}
'use strict'


const { sequelize } = require("../../models");
const { validateEmail } = require('../../helpers/validations')

module.exports = (sequelize, DataTypes) => {
    const Attendee = sequelize.define('attendee', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        firstName: {
            allowNull: false,
            type: DataTypes.TEXT,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'last_name'
        },
        email: {
            allowNull: false,
            type: DataTypes.TEXT,
            field: 'email'
        },
        userId: {
            allowNull: true,
            type: DataTypes.INTEGER,
            field: 'id_user',
        },
        eventId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_event',
        },
        isPresent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_present'
        },/*
        ticketSaleDetailId:{
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'is_ticket_sale_detail',
        } */

    },
        {
            tableName: "attendees"
        }
    );

    Attendee.associate = function (models) {
        //To create model associations
        /*
        Attendee.belongsTo(models.ticket_sale_detail, {
            foreignKey: 'id_ticket_sale_detail',
            as: 'ticket_sale_detail'
        });
        */

        Attendee.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

        Attendee.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        /*
        Attendee.hasMany(models.session_attendee, {
            foreignKey: 'id_attendee',
            as: 'attendee_session_attendee'
        });*/
    }

    Attendee.exists = async function (id) {
		if(!id) {
			throw new Error('Attendee ID is required')
		}
		const count = await this.count({
            where: {
                id
            }
        })
		return count > 0;
	}


    Attendee.validateFirstName = function (value) {
        if (!value) {
            throw new Error('First name is required')
        }
        return typeof value === typeof '' &&
        !/[.0-9!_@#\d½º<>↓;?:¡¿|/[¨{}\$%\^\&*\])\(+=._-]/g.test(value);
    }

    Attendee.validateLastName = function (value) {
        if (!value) {
            throw new Error('Last name is required')
        }
        return typeof value === typeof '' &&
            !/[.0-9!_@#\d½º<>↓;?:¡¿|/[¨{}\$%\^\&*\])\(+=._-]/g.test(value);
    }

    Attendee.validateEmail = function (value) {
        if (!value) {
            throw new Error('Email is required')
        }
        if (!validateEmail(value)) {
            throw new Error('Email has unvalid characters')
        }
        return typeof value === typeof '' && value.length > 5;
    }

    return Attendee;
}
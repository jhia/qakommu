'use strict'

const { validateEmail, validateName } = require('../../helpers/validations')

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
        },
        ticketSaleDetailId:{
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_ticket_sale_detail',
        }

    },
        {
            tableName: "attendees"
        }
    );

    Attendee.associate = function (models) {
        //To create model associations
        
        Attendee.belongsTo(models.ticketSaleDetail, {
            foreignKey: 'id_ticket_sale_detail',
            as: 'ticket'
        });
        

        Attendee.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });

        Attendee.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        Attendee.belongsToMany(models.session, {
            through: 'session_attendees',
            foreignKey: 'id_attendee',
            otherKey: 'id_session',
            as: 'sessions'
        });
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
    
    Attendee.ticketAlreadyUsed = async function(value) {
        if(!value) {
            throw new Error('Ticket id is required')
        }

        const count = await this.count({
            where: {
                ticketSaleDetailId: value
            }
        })
        return count > 0;
    }


    Attendee.validateFirstName = validateName;

    Attendee.validateLastName = validateName;

    Attendee.validateEmail = validateEmail;

    return Attendee;
}
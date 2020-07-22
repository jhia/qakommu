'use strict'

module.exports = (sequelize, DataTypes) => {
    const ticket_sale_detail = sequelize.define('ticket_sale_detail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        uuid: {
            allowNull: false,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            
        },
        id_ticket_sale: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        deactivated: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        }
    });

    ticket_sale_detail.associate = function (models) {
        //To create model associations

        ticket_sale_detail.belongsTo(models.ticket_sale, {
            foreignKey: 'id_ticket_sale',
            as: 'ticket_sale'
        });

        ticket_sale_detail.hasMany(models.attendee, {
            foreignKey: 'id_ticket_sale_detail',
            as: 'ticket_sale_detail_attendee'
        });
    }

    return ticket_sale_detail;
}
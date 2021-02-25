'use strict'

module.exports = (sequelize, DataTypes) => {
    const TicketSaleDetail = sequelize.define('ticketSaleDetail', {
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
            unique: true
        },
        ticketSaleId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            field: 'id_ticket_sale'
        },
        deactivated: {
            allowNull: false,
            defaultValue: false,
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'ticket_sale_details'
    });

    TicketSaleDetail.associate = function (models) {
        //To create model associations

        TicketSaleDetail.belongsTo(models.ticketSale, {
            foreignKey: 'id_ticket_sale',
            as: 'ticketSale'
        });

        TicketSaleDetail.hasOne(models.attendee, {
            foreignKey: 'id_ticket_sale_detail',
            as: 'attendee'
        });
    }

    TicketSaleDetail.findByUUID = function (uuid, options={}) {
		if(!uuid) {
			throw new Error('Invitation code is required')
		}
		return this.findOne({
			where: {
				uuid
			},
			...options
		})
	}

    return TicketSaleDetail;
}
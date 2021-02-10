'use strict'

module.exports = (sequelize, DataTypes) => {
    const BoothType = sequelize.define('boothType', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        cost: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        width: {
            field: 'size_width',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        height: {
            field: 'size_height',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        communityId: {
            field: 'id_community',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: { tableName: 'communities' },
                key: 'id'
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'booth_types'
    });

    BoothType.associate = function (models) {
        //To create model associations

        // type_booth to exhibitor
        BoothType.hasMany(models.exhibitor, {
            foreignKey: 'id_booth_type',
            as: 'exhibitors'
        });

        //type_booth to community
        BoothType.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });
    }

    BoothType.exists = async function (id) {
		if(!id) {
			throw new Error('Booth Type ID is required')
		}
		const type = await this.findByPk(id, { attributes: ['id'] })
		return !!type;
	}

    BoothType.validateName = function (value) {
        if(!name) {
            throw new Error('Name is required');
        }
        return typeof value === typeof '' && value.length > 0;
    }

    BoothType.validateDescription = function (value) {
        if(!value) {
            throw new Error('Description is required');
        }
        return typeof value === typeof '' && value.length > 0;
    }

    BoothType.validateCost = function (value) {
        if(!value) {
            throw new Error('Cost is required');
        }
        return value >= 0;
    }

    BoothType.validateWidth = function (value) {
        if(!value) {
            throw new Error('Width is required');
        }
        return value > 0;
    }

    BoothType.validateHeight = function (value) {
        if(!value) {
            throw new Error('Height is required');
        }
        return value > 0;
    }

    return BoothType;
}
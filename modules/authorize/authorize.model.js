'use strict'
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    

    const Authorize = sequelize.define('authorize', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'refresh_token',
            unique: true
        },
        userId: {
            field: 'id_user',
            type: DataTypes.INTEGER,
            references: {
                model: {
                tableName: 'users'
                },
                key: 'id'
            },
            allowNull: false
        }
    }, {
        tableName: 'refresh_tokens',
    })

    Authorize.associate = function(models){
        //To create model associations
        Authorize.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        })
    }

    Authorize.prototype.generateAccessToken = function (secret) {
        const date = new Date()
        date.setDate(date.getDate() + 2)

        const accessToken = jwt.sign({
            user: this.userId
        }, secret, {
            expiresIn: '2d',
            algorithm: 'HS512'
        });

        return {
            accessToken,
            expiresIn: date
        }
    }

    return Authorize;
}
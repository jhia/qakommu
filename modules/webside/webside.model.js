'use strict'

module.exports = (sequelize, DataTypes) => {
    const webside = sequelize.define('webside', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        title: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        head: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        body: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        script: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        footer: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        main_page: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        url: {
            allowNull: false,
            type: DataTypes.TEXT
        }

    });

    webside.associate = function (models) {
        //To create model associations
    }

    return webside;
}
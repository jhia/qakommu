'use strict'

module.exports = (sequelize, DataTypes) => {
    const repository = sequelize.define('repository', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        location: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        }
    });

    repository.associate = function (models) {
        //To create model associations

    }

    return repository;
}
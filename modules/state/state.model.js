'use strict'

module.exports = (sequelize, DataTypes) => {
    const States = sequelize.define('state', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        module_name: {
          type: DataTypes.STRING,
          allowNull: false
        }, 
        bloker: DataTypes.BOOLEAN
    },{
       // Timestamps
       
    });
    return States;
};
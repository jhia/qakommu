'use strict'

module.exports = (sequelize, DataTypes) => {
    const module_name = sequelize.define('module_name', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
        name: {
            allowNull:false,
            type: DataTypes.TEXT
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    module_name.associate = function(models){
        //To create model associations
        module_name.hasMany(models.state, {
            foreignKey: 'id_module_name',
            as: 'module_name_state'
        });
    }

    return module_name;
}
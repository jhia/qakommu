'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tickets', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      id_event: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'events'
          },
          key: 'id'
        }
      },
      base_price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      quantity_total: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      quantity_current: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      reserved: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      reserved_current: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      limit_sale: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      max_ticket_sale: Sequelize.INTEGER,
      start: {
        type: Sequelize.DATE
      },
      end: {
        type: Sequelize.DATE
      },
      is_draft: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      },
      use_multiprice_1: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      title1: Sequelize.STRING,
      price1: Sequelize.DOUBLE,
      since1: Sequelize.DATE,
      until1: Sequelize.DATE,
      percentage1: Sequelize.FLOAT,
      is_discount1: Sequelize.BOOLEAN,
      use_multiprice_2: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      title2: Sequelize.STRING,
      price2: Sequelize.DOUBLE,
      since2: Sequelize.DATE,
      until2: Sequelize.DATE,
      percentage2: Sequelize.FLOAT,
      is_discount2: Sequelize.BOOLEAN,
      use_multiprice_3: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      title3: Sequelize.STRING,
      price3: Sequelize.DOUBLE,
      since3: Sequelize.DATE,
      until3: Sequelize.DATE,
      percentage3: Sequelize.FLOAT,
      is_discount3: Sequelize.BOOLEAN,
      use_multiprice_4: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      title4: Sequelize.STRING,
      price4: Sequelize.DOUBLE,
      since4: Sequelize.DATE,
      until4: Sequelize.DATE,
      percentage4: Sequelize.FLOAT,
      is_discount4: Sequelize.BOOLEAN,
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tickets');
  }
};

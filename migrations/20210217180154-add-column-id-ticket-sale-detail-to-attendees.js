'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('attendees', 'id_ticket_sale_detail', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: { tableName: 'ticket_sale_details' },
        key: 'id'
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('attendees', 'id_ticket_sale_detail')
  }
};

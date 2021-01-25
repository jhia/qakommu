'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('memberships', [
      {
        id: 1,
        name: 'Basic',
        description: 'Covers the basic usage, no extras',
        price: 0,
        free: true,
        duration: -1, //no renew needed, forever
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { ignoreOnDuplicates: true });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('memberships', null, {})
  }
};

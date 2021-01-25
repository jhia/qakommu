'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('memberships', [
      {
        id: 1,
        name: 'Basic',
        description: 'Covers the basic usage, no extras',
        price: 0,
        free: true,
        duration: -1 //no renew needed, forever
      }
    ], { ignoreOnDuplicates: true });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('memberships', null, {})
  }
};

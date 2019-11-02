'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
        id: 1,
        description: 'admin',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('Roles', null, {});
  }
};

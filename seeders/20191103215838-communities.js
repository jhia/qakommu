'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Communities', [{
        name: 'python',
        description: 'A Communities of python',
        web: 'www.python.com',
        prefix: 'py',
        member_verification: true
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Communities', null, {});
  }
};

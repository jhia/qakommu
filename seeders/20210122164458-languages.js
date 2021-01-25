'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('languages', [
      {
        id: 1,
        name: 'English',
        code: 'en'
      },
      {
        id: 2,
        name: 'Español',
        code: 'es'
      }
    ], { ignoreDuplicates: true })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('languages', null, {})
  }
};

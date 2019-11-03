'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Events', [{
        title: 'python Conferences',
        description: 'conferences about python',
        communityId: 1,
        start: new Date('2019-12-10'),
        end: new Date('2019-12-20'),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Events', null, {});
  }
};

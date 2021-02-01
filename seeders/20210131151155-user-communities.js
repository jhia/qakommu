'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user_communities', [
      {
        id: 1,
        id_user: 1,
        id_community: 1
      },
      {
        id: 2,
        id_user: 2,
        id_community: 1
      },
      {
        id: 3,
        id_user: 3,
        id_community: 1
      },
      {
        id: 4,
        id_user: 4,
        id_community: 1
      },
      {
        id: 5,
        id_user: 5,
        id_community: 1
      },
      {
        id: 6,
        id_user: 6,
        id_community: 1
      },
      {
        id: 7,
        id_user: 7,
        id_community: 1
      },
      {
        id: 8,
        id_user: 8,
        id_community: 1
      },
      {
        id: 9,
        id_user: 9,
        id_community: 1
      },
      {
        id: 10,
        id_user: 10,
        id_community: 1
      },
      {
        id: 11,
        id_user: 11,
        id_community: 1
      },
      {
        id: 12,
        id_user: 12,
        id_community: 1
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user_communities', null, {}); 
  }
};

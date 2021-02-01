'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('communities', [
      {
        id: 1,
        name: 'Kommu',
        description: 'Main community',
        active: true,
        prefix: 'my-kommu',
      // member needs verification
      member_verification: false,
      code: 'KOMMU',
      is_private: false,
      },
      {
        id: 2,
        name: "python",
        description: "description to python",
        prefix: "python",
        member_verification: true,
        code: "0JWCT2",
        is_private: false
      },
      {
        id: 3,
        name: "node",
        description: "description to node",
        prefix: "node",
        member_verification: true,
        code: "8OTUHR",
        is_private: false
      }
    ], { ignoreOnDuplicates: true })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('communities', null, {})
  }
};

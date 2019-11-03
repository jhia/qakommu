'use strict';

function allUsers(queryInterface){
  return queryInterface.sequelize.query(
      'SELECT id from public."Users"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
  );
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const Users = await allUsers(queryInterface);

    const inserts = Users.map((user) => {
      return {
        communityId: 1,
        userId: user.id,
      };
    });

    return queryInterface.bulkInsert('UsersCommunities', inserts, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UsersCommunities', null, {});
  }
};

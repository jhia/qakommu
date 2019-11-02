'use strict';

async function getUserUuid(queryInterface){
    const sql = "SELECT id from public.\"Users\" WHERE email='nigga@mail.com' LIMIT 1";
    const user = await queryInterface.sequelize.query(
      sql, {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    return user[0].id;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('UsersRoles', [{
        userId: await getUserUuid(queryInterface),
        rolId: 1,
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('UsersRoles', null, {});
  }
};

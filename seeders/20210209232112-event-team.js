'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('event_team', [
        {
          id: 1,
          id_event: 1,
          id_user: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          id_event: 2,
          id_user: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          id_event: 3,
          id_user: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          id_event: 4,
          id_user: 1,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          id_event: 1,
          id_user: 3,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          id_event: 2,
          id_user: 3,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          id_event: 3,
          id_user: 3,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM event_team", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('event_team_id_seq', ${maxid})`, {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('event_team', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM event_team", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('event_team_id_seq', ${maxid})`, {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};

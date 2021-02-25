'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('event_tracks', [
        {
          id: 1,
          id_event: 2,
          id_track: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM event_tracks", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('event_tracks_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('event_tracks', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM event_tracks", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('event_tracks_id_seq', ${maxid})`, {
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

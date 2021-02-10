'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('tracks', [
        {
          id: 1,
          "name": "back-end",
          "description": "is the logic that is processed on the server side",
          "active": true,
          "id_community": 2,
          "icon": "search",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          "name": "Database",
          "description": "everything related to database",
          "active": true,
          "icon": "search",
          id_community: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          "name": "DJango",
          "description": "",
          "active": true,
          "id_community": 3,
          "icon": "search",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM tracks", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('tracks_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('tracks', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM tracks", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('tracks_id_seq', ${maxid})`, {
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

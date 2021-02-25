'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.bulkInsert('partnerships', [
        {
          id: 1,
          "name": "Google company",
          "description": "test description",
          "web": "www.google.com",
          "active": true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM partnerships", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('partnerships_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('sessions', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM sessions", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('sessions_id_seq', ${maxid})`, {
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
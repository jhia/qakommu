'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('sponsor_types', [
        {
          id: 1,
          "name": "general",
          "description": "standard fee for sponsors",
          "contribution_value": 500,
          "active": true,
          "id_community":1,
          "display_number":3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          "name": "premium",
          "description": "premium for sponsors",
          "contribution_value": 700,
          "active": true,
          "id_community":1,
          "display_number":5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          "name": "low cost",
          "description": "low cost  for sponsors",
          "contribution_value": 100,
          "active": true,
          "id_community":1,
          "display_number":1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM sponsor_types", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('sponsor_types_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('sponsor_types', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM sponsor_types", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('sponsor_types_id_seq', ${maxid})`, {
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
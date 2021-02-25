'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('booth_types', [
        {
          id: 1,
          "name": "standard",
          "description": "generic size",
          "cost": 887.12,
          "size_width": 10,
          "size_height": 10,
          "active": true,
          "id_community": 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          "name": "small",
          "description": "small size",
          "cost": 505.12,
          "size_width": 5,
          "size_height": 5,
          "active": true,
          "id_community": 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          "name": "large",
          "description": "large size",
          "cost": 1300.10,
          "size_width": 25,
          "size_height": 25,
          "active": true,
          "id_community": 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM booth_types", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('booth_types_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('booth_types', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM booth_types", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('booth_types_id_seq', ${maxid})`, {
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
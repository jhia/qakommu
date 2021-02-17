'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('attendees', [
        {
          "id": 1,
          "first_name": "Patricia Chae",
          "last_name": "Ellett Meneses",
          "email": "p_ellett87@kommu.com",
          "id_user": 3,
          "id_event": 1,
          "is_present": true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 2,
          "first_name": "Bennie Jane",
          "last_name": "Bond Stryker",
          "email": "b_bond88@kommu.com",
          "id_user": 12,
          "id_event": 1,
          "is_present": true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 3,
          "first_name": "Jeanette Susan",
          "last_name": "Jenkins Steiner",
          "email": "j_jenkins988@kommu.com",
          "id_user": 6,
          "id_event": 1,
          "is_present": true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 4,
          "first_name": "Alexander Levi",
          "last_name": "Smith Brown",
          "email": "a_Smith225@kommu.com",
          "id_user": 7,
          "id_event": 1,
          "is_present": true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 5,
          "first_name": "Alexander Levi",
          "last_name": "Smith Brown",
          "email": "a_Smith225@kommu.com",
          "id_user": 7,
          "id_event": 2,
          "is_present": true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM attendees", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('attendees_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('attendees', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM attendees", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('attendees_id_seq', ${maxid})`, {
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

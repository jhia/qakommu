'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('ticket_sales', [
        {
          id: 1,
          "id_ticket": 1,
          "id_user": 2,
          "count": 1,
          "unit_amount": 150,
          "total_amount": 150,
          "total_amount_paid": 150,
          "price_type": "PB",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM ticket_sales", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('ticket_sales_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('ticket_sales', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM ticket_sales", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('ticket_sales_id_seq', ${maxid})`, {
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

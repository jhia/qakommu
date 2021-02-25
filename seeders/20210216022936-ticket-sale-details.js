'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('ticket_sale_details', [
        {
          id: 1,
          'uuid': 'cbd52136-c8c8-447e-9f29-9735458e98ff',
          "id_ticket_sale": 1,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          'uuid': 'c37c4e54-76bf-42aa-9be2-18b94650580c',
          "id_ticket_sale": 2,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          'uuid': 'ab03f7c2-a7cf-4525-931e-2e2bbad4f756',
          "id_ticket_sale": 2,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          'uuid': 'd4e950bb-4fcf-4ea0-906a-ed48347ef36c',
          "id_ticket_sale": 2,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          'uuid': '741a5b4e-8e80-45ed-b2c5-225c7632d9b1',
          "id_ticket_sale": 2,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          'uuid': '7971b2dc-8b86-469a-a6aa-4923cfb2f0df',
          "id_ticket_sale": 3,
          "deactivated": false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM ticket_sale_details", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('ticket_sale_details_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('ticket_sale_details', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM ticket_sale_details", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('ticket_sale_details_id_seq', ${maxid})`, {
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

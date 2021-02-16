'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('tickets', [
        {
          id: 1,
          "name": "Early Bird",
          "description": "With Early Bird you have the opportunity to get the tickets with the lowest price",
          "is_draft": false,
          "id_event": 1,
          "base_price": 120,
          "quantity_total": 100,
          "quantity_current": 100,
          "reserved": 5,
          "reserved_current": 5,
          "limit_sale": true,
          "max_ticket_sale": 5,
          "start": "2020-05-05",
          "end": "2020-05-15",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          "name": "test ticket",
          "description": "test description of pruebe",
          "is_draft": false,
          "id_event": 2,
          "base_price": 100,
          "quantity_total": 100,
          "quantity_current": 100,
          "reserved": 0,
          "limit_sale": true,
          "max_ticket_sale": 50,
          "start": "2020-05-01",
          "end": "2020-12-20",
          "use_multiprice_1": true,

          'title1': "super early early bird",
          "since1": "2020-05-10",
          "until1": "2020-05-15",
          "percentage1": 30,
          "is_discount1": true,

          "use_multiprice_2": true,
          'title2': "early early bird",
          "since2": "2020-08-2",
          "until2": "2020-09-20",
          "percentage2": 20,
          "is_discount2": true,
      
          "use_multiprice_3": true,
          'title3': "early bird",
          "since3": "2020-09-21",
          "until3": "2020-11-20",
          "percentage3": 10,
          "is_discount3": true,
      
          "use_multiprice_4": true,
          'title4': "today is more",
          "since4": "2020-11-21",
          "until4": "2020-12-1",
          "percentage4": 5,
          "is_discount4": false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM tickets", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('tickets_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('tickets', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM tickets", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('tickets_id_seq', ${maxid})`, {
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

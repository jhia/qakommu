'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.bulkInsert('events', [
        {
          "id": 1,
          "name": "CES 2020",
          "description": "CES® is the most influential tech event in the world — the proving ground for breakthrough technologies and global innovators. This is where the world's biggest brands do business and meet new partners, and the sharpest innovators hit the stage. Owned and produced by the Consumer Technology Association (CTA)®, CES features every aspect of the tech sector.",
          "id_community": 1,
          "type": "w",
          "online": false,
          "no_cfp": true,
          "url_code": "https://www.ces.tech",
          "is_private": false,
          "start": "2020-01-11",
          "end": "2020-01-14",
          "active": true,
          "prom_rate": 89.8,
          "image": "event_DY72EI.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 2,
          "name": "Oracle Code 2020",
          "description": "Oracle Code is a free event for developers to explore the latest and greatest technologies, practices, and trends. Please check back often for updates on upcoming Oracle Code events.",
          "id_community": 1,
          "type": "c",
          "online": false,
          "no_cfp": false,
          "url_code": "https://developer.oracle.com/code/",
          "is_private": false,
          "start": "2020-09-22",
          "end": "2020-09-24",
          "active": true,
          "prom_rate": 89.8,
          "image": "event_3H0945.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 3,
          "name": "microsoft ignite",
          "description": "Microsoft Ignite | Microsoft's annual gathering of technology leaders and practitioners delivered as a digital event experience this September.",
          "id_community": 1,
          "type": "w",
          "online": false,
          "no_cfp": true,
          "url_code": "https://myignite.microsoft.com",
          "is_private": false,
          "start": "2020-09-21",
          "end": "2020-09-24",
          "active": true,
          "prom_rate": 89.8,
          "image": "event_IOZC8S.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "id": 4,
          "name": "Deep Learning Summit",
          "description": "Access the current trends and developments in deep learning and machine intelligence to strengthen your skills and advance your business.",
          "id_community": 1,
          "type": "w",
          "online": false,
          "no_cfp": true,
          "url_code": "https://www.re-work.co/events/deep-learning-summit-san-francisco-2020",
          "is_private": false,
          "start": "2020-09-24",
          "end": "2020-09-25",
          "active": true,
          "prom_rate": 89.8,
          "image": "event_H1RN6X.png",
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM events", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('events_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('events', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM events", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('events_id_seq', ${maxid})`, {
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

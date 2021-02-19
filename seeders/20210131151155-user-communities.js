'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('user_communities', [
        { id: 1, id_user: 1, id_community: 1, owner: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, id_user: 2, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 3, id_user: 3, id_community: 1, owner: true, createdAt: new Date(), updatedAt: new Date() },
        { id: 4, id_user: 4, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 5, id_user: 5, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 6, id_user: 6, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 7, id_user: 7, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 8, id_user: 8, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 9, id_user: 9, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 10, id_user: 10, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 11, id_user: 11, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
        { id: 12, id_user: 12, id_community: 1, owner: false, createdAt: new Date(), updatedAt: new Date() },
      ], { transaction, ignoreDuplicates: true });

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM user_communities", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('user_communities_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('user_communities', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM user_communities", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('user_communities_id_seq', ${maxid})`, {
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

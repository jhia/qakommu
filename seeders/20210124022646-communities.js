'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert('communities', [
        {
          id: 1,
          name: 'Kommu',
          description: 'Main community',
          active: true,
          prefix: 'my-kommu',
          // member needs verification
          member_verification: false,
          code: 'KOMMU',
          is_private: false,
        },
        {
          id: 2,
          name: "python",
          description: "description to python",
          prefix: "python",
          member_verification: true,
          code: "0JWCT2",
          is_private: false
        },
        {
          id: 3,
          name: "node",
          description: "description to node",
          prefix: "node",
          member_verification: true,
          code: "8OTUHR",
          is_private: false
        }
      ], { transaction, ignoreDuplicates: true })

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM communities", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('communities_id_seq', ${maxid})`, {
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
      await queryInterface.bulkDelete('communities', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM communities", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('communities_id_seq', ${maxid})`, {
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

'use strict';
const https = require('https');

function getCountries() {
  return new Promise((resolve, reject) => {
    let data = '';
    const callback = function(response) {
      response.on('data', chunk => { data += chunk })
      response.on('end', () => {
        const countries = JSON.parse(data).map(c => ({
          name: c.name,
          alpha_code_3: c.alpha3Code,
          phone_code: c.callingCodes[0],
          id_language: c.languages[0].iso639_1 === 'es' ? 2 : 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }))

        resolve(countries)
      })
      response.on('error', reject)
    }
    https.request('https://restcountries.eu/rest/v2/all', callback).end();
  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // start transaction
    const transaction = await queryInterface.sequelize.transaction();

    try {
      let countries = await getCountries();

      // add rows
      await queryInterface.bulkInsert('countries', countries, {
        transaction,
        ignoreDuplicates: true
      })

      // get max id
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM countries", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      const maxid = rows[0].maxid

      // setup secuence manually for id
      await queryInterface.sequelize.query(`SELECT setval('countries_id_seq', ${maxid})`, {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })

      //save
      await transaction.commit();

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('countries', null, { transaction })
      const rows = await queryInterface.sequelize.query("SELECT max(id) as maxid FROM countries", {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      })
      const maxid = rows[0].maxid
      await queryInterface.sequelize.query(`SELECT setval('countries_id_seq', ${maxid})`, {
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

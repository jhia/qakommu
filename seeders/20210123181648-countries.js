'use strict';
const https = require('https');

module.exports = {
  up: (queryInterface, Sequelize) => {

    return new Promise((resolve, reject) => {
      let data = '';
      const callback = function(response) {
        response.on('data', chunk => { data += chunk })
        response.on('end', () => {
          const countries = JSON.parse(data).map(c => ({
            name: c.name,
            alpha_code_3: c.alpha3Code,
            phone_code: c.callingCodes[0],
            id_language: c.languages[0].iso639_1 === 'es' ? 2 : 1
          }))

          resolve(queryInterface.bulkInsert(
            'countries',
            countries,
            { ignoreDuplicates: true }
          ))
        })
        response.on('error', reject)
      }
      https.request('https://restcountries.eu/rest/v2/all', callback).end();
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('countries', null, {});
  }
};

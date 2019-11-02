'use strict';
const bcrypt = require('bcrypt');

function encrypt_password(password){
  const saltRounds = 10;
  const newPassword = password || 'admin';
  return bcrypt.hashSync(newPassword, saltRounds);
}

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
        name: 'Alexis',
        last_name: 'nigga',
        email: 'nigga@mail.com',
        active: true,
        password: encrypt_password('admin'),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};

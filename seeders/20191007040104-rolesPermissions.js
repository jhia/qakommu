'use strict';

function allPermissions(queryInterface){
  return queryInterface.sequelize.query(
      'SELECT id from public."Permissions"', {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
  );
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = await allPermissions(queryInterface);

    const inserts = permissions.map( (permission) => {
      return {
        rolId: 1,
        perId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    return queryInterface.bulkInsert('PermissionsRoles', inserts, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PermissionsRoles', null, {});
  }
};

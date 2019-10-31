'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Resources', [
          //Users
          {
              module_name: 'users',
              action: 'create',
              description: 'Create Users',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'users',
              action: 'read',
              description: 'Read Users',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'users',
              action: 'update',
              description: 'Update Users',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'users',
              action: 'delete',
              description: 'Delete Users',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          //Roles
          {
              module_name: 'roles',
              action: 'create',
              description: 'Create Roles',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'roles',
              action: 'read',
              description: 'Read Roles',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'roles',
              action: 'update',
              description: 'Update Roles',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'roles',
              action: 'delete',
              description: 'Delete Roles',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          //Permissions
          {
              module_name: 'permissions',
              action: 'create',
              description: 'Create Permissions',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'permissions',
              action: 'read',
              description: 'Read Permissions',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'permissions',
              action: 'update',
              description: 'Update Permissions',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'permissions',
              action: 'delete',
              description: 'Delete Permissions',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          //Resources
          {
              module_name: 'resources',
              action: 'create',
              description: 'Create Resources',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'resources',
              action: 'read',
              description: 'Read Resources',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'resources',
              action: 'update',
              description: 'Update Resources',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'resources',
              action: 'delete',
              description: 'Delete Resources',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          //me
          {
              module_name: 'me',
              action: 'read',
              description: 'Read me',
              createdAt: new Date(),
              updatedAt: new Date()
          },
          {
              module_name: 'me',
              action: 'update',
              description: 'Update me',
              createdAt: new Date(),
              updatedAt: new Date()
          },
      ], {})
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Resources', null, {});
  }
};

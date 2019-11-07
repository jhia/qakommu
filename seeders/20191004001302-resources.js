'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Resources', [
          //Users
          {
              module_name: 'users',
              action: 'create',
              description: 'Create Users',
          },
          {
              module_name: 'users',
              action: 'read',
              description: 'Read Users',
          },
          {
              module_name: 'users',
              action: 'update',
              description: 'Update Users',
          },
          {
              module_name: 'users',
              action: 'delete',
              description: 'Delete Users',
          },
          //Roles
          {
              module_name: 'roles',
              action: 'create',
              description: 'Create Roles',
          },
          {
              module_name: 'roles',
              action: 'read',
              description: 'Read Roles',
          },
          {
              module_name: 'roles',
              action: 'update',
              description: 'Update Roles',
          },
          {
              module_name: 'roles',
              action: 'delete',
              description: 'Delete Roles',
          },
          //Permissions
          {
              module_name: 'permissions',
              action: 'create',
              description: 'Create Permissions',
          },
          {
              module_name: 'permissions',
              action: 'read',
              description: 'Read Permissions',
          },
          {
              module_name: 'permissions',
              action: 'update',
              description: 'Update Permissions',
          },
          {
              module_name: 'permissions',
              action: 'delete',
              description: 'Delete Permissions',
          },
          //Resources
          {
              module_name: 'resources',
              action: 'create',
              description: 'Create Resources',
          },
          {
              module_name: 'resources',
              action: 'read',
              description: 'Read Resources',
          },
          {
              module_name: 'resources',
              action: 'update',
              description: 'Update Resources',
          },
          {
              module_name: 'resources',
              action: 'delete',
              description: 'Delete Resources',
          },
          //me
          {
              module_name: 'me',
              action: 'read',
              description: 'Read me',
          },
          {
              module_name: 'me',
              action: 'update',
              description: 'Update me',
          },
          //Communities
          {
              module_name: 'communities',
              action: 'create',
              description: 'Create communities',
          },
          {
              module_name: 'communities',
              action: 'read',
              description: 'Read communities',
          },
          {
              module_name: 'communities',
              action: 'update',
              description: 'Update communities',
          },
          {
              module_name: 'communities',
              action: 'delete',
              description: 'Delete communities',
          },
          //Events
          {
              module_name: 'events',
              action: 'create',
              description: 'Create events',
          },
          {
              module_name: 'events',
              action: 'read',
              description: 'Read events',
          },
          {
              module_name: 'events',
              action: 'update',
              description: 'Update events',
          },
          {
              module_name: 'events',
              action: 'delete',
              description: 'Delete events',
          },
          //Themes
          {
              module_name: 'themes',
              action: 'create',
              description: 'Create themes',
          },
          {
              module_name: 'themes',
              action: 'read',
              description: 'Read themes',
          },
          {
              module_name: 'themes',
              action: 'update',
              description: 'Update themes',
          },
          {
              module_name: 'themes',
              action: 'delete',
              description: 'Delete themes',
          },
      ], {})
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Resources', null, {});
  }
};

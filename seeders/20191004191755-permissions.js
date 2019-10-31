'use strict';

async function getResourceId(queryInterface, module_name, action){
    const resources = await queryInterface.sequelize.query(
        `SELECT id from public."Resources" WHERE module_name='${module_name}' AND action='${action}' LIMIT 1`, {
            type: queryInterface.sequelize.QueryTypes.SELECT
        }
    );
    const res = resources[0];
    return res.id;
}

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Permissions', [
            //users
            {
                resId: await getResourceId(queryInterface,'users', 'create'),
                description: 'create users',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'users', 'read'),
                description: 'read users',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'users', 'update'),
                description: 'update users',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'users', 'delete'),
                description: 'delete users',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            //Roles
            {
                resId: await getResourceId(queryInterface,'roles', 'create'),
                description: 'create roles',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'read'),
                description: 'read roles',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'update'),
                description: 'update roles',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'delete'),
                description: 'delete roles',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            //Permissions
            {
                resId: await getResourceId(queryInterface,'permissions', 'create'),
                description: 'create permissions',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'read'),
                description: 'read permissions',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'update'),
                description: 'update permissions',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'delete'),
                description: 'delete permissions',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            //Resources
            {
                resId: await getResourceId(queryInterface,'resources', 'create'),
                description: 'create resources',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'read'),
                description: 'read resources',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'update'),
                description: 'update resources',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'delete'),
                description: 'delete resources',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            //Me
            {
                resId: await getResourceId(queryInterface,'me', 'read'),
                description: 'read me',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                resId: await getResourceId(queryInterface,'me', 'update'),
                description: 'update me',
                createdAt: new Date(),
                updatedAt: new Date()
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Permissions', null, {});
    }
};

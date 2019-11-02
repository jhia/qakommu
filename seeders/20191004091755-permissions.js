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
            },
            {
                resId: await getResourceId(queryInterface,'users', 'read'),
                description: 'read users',
            },
            {
                resId: await getResourceId(queryInterface,'users', 'update'),
                description: 'update users',
            },
            {
                resId: await getResourceId(queryInterface,'users', 'delete'),
                description: 'delete users',
            },
            //Roles
            {
                resId: await getResourceId(queryInterface,'roles', 'create'),
                description: 'create roles',
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'read'),
                description: 'read roles',
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'update'),
                description: 'update roles',
            },
            {
                resId: await getResourceId(queryInterface,'roles', 'delete'),
                description: 'delete roles',
            },
            //Permissions
            {
                resId: await getResourceId(queryInterface,'permissions', 'create'),
                description: 'create permissions',
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'read'),
                description: 'read permissions',
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'update'),
                description: 'update permissions',
            },
            {
                resId: await getResourceId(queryInterface,'permissions', 'delete'),
                description: 'delete permissions',
            },
            //Resources
            {
                resId: await getResourceId(queryInterface,'resources', 'create'),
                description: 'create resources',
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'read'),
                description: 'read resources',
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'update'),
                description: 'update resources',
            },
            {
                resId: await getResourceId(queryInterface,'resources', 'delete'),
                description: 'delete resources',
            },
            //Me
            {
                resId: await getResourceId(queryInterface,'me', 'read'),
                description: 'read me',
            },
            {
                resId: await getResourceId(queryInterface,'me', 'update'),
                description: 'update me',
            },
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Permissions', null, {});
    }
};

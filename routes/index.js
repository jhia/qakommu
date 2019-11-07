const router = require('express').Router();

//Users
const users_router = require('./users');
router.use('/users', users_router);
//Roles
const roles_router = require('./roles');
router.use('/roles', roles_router);
//Permissions
const permissions_router = require('./permissions');
router.use('/permissions', permissions_router);
//Resources
const resources_router = require('./resources');
router.use('/resources', resources_router);
//Resources
const communities_router = require('./communities');
router.use('/communities', communities_router);


module.exports = router;
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
//Communities
const communities_router = require('./communities');
router.use('/communities', communities_router);
//Events
const events_router = require('./events');
router.use('/events', events_router);


module.exports = router;
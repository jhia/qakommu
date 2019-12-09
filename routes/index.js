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
//Themes
const themes_router = require('./themes');
router.use('/themes', themes_router);
//Forms
const forms_router = require('./forms');
router.use('/forms', forms_router);
//Inputs
const inputs_router = require('./inputs');
router.use('/inputs', inputs_router);
//Inputs_Data
const inputs_data_router = require('./inputs_data');
router.use('/inputs_data', inputs_data_router);

module.exports = router;

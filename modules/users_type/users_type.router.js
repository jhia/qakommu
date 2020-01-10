const router = require('express').Router();
const users_type_controller = require('./users_type.controller');
router.all('/:id?', (req, res) => {
  new users_type_controller(req, res);
});
module.exports = router;

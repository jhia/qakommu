const router = require('express').Router();
const user_controller = require('../controllers/user.controller');
router.all('/:id?', (req, res) => {
  new user_controller(req, res);
});
module.exports = router;

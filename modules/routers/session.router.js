const router = require('express').Router();
const session_controller = require('../controllers/session.controller');
router.all('/:id?', (req, res) => {
  new session_controller(req, res);
});
module.exports = router;

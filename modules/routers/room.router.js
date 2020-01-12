const router = require('express').Router();
const room_controller = require('../controllers/room.controller');
router.all('/:id?', (req, res) => {
  new room_controller(req, res);
});
module.exports = router;

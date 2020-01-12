const router = require('express').Router();
const type_booth_controller = require('../controllers/type_booth.controller');
router.all('/:id?', (req, res) => {
  new type_booth_controller(req, res);
});
module.exports = router;

const router = require('express').Router();
const object_type_controller = require('./object_type.controller');
router.all('/:id?', (req, res) => {
  new object_type_controller(req, res);
});
module.exports = router;

const router = require('express').Router();
const exhibitor_controller = require('./exhibitor.controller');
router.all('/:id?', (req, res) => {
  new exhibitor_controller(req, res);
});
module.exports = router;

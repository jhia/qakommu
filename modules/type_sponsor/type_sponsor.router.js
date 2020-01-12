const router = require('express').Router();
const type_sponsor_controller = require('./type_sponsor.controller');
router.all('/:id?', (req, res) => {
  new type_sponsor_controller(req, res);
});
module.exports = router;

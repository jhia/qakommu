const router = require('express').Router();
const form_controller = require('../controllers/form.controller');
router.all('/:id?', (req, res) => {
  new form_controller(req, res);
});
module.exports = router;

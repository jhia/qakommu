const router = require('express').Router();
const company_controller = require('../controllers/company.controller');
router.all('/:id?', (req, res) => {
  new company_controller(req, res);
});
module.exports = router;

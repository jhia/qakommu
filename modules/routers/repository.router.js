const router = require('express').Router();
const repository_controller = require('../controllers/repository.controller');
router.all('/:id?', (req, res) => {
  new repository_controller(req, res);
});
module.exports = router;

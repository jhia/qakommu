const router = require('express').Router();
const tag_controller = require('../controllers/tag.controller');
router.all('/:id?', (req, res) => {
  new tag_controller(req, res);
});
module.exports = router;

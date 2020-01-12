const router = require('express').Router();
const repository_object_controller = require('./repository_object.controller');
router.all('/:id?', (req, res) => {
  new repository_object_controller(req, res);
});
module.exports = router;

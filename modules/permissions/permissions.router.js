const router = require('express').Router();
const permissions = require('./permissions.controller');
router.all('/:id?', (req, res) => {
  new permissions(req, res);
});
module.exports = router;

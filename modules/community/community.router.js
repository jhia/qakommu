const router = require('express').Router();
const community_controller = require('./community.controller');
router.all('/:id?', (req, res) => {
  new community_controller(req, res);
});
module.exports = router;

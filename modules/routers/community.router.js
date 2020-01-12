const router = require('express').Router();
const community_controller = require('../controllers/community.controller');
router.all('/:id?', (req, res) => {
  new community_controller(req, res);
});
module.exports = router;

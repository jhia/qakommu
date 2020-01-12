const router = require('express').Router();
const community_tag_controller = require('../controllers/community_tag.controller');
router.all('/:id?', (req, res) => {
  new community_tag_controller(req, res);
});
module.exports = router;

const router = require('express').Router();
const call_for_paper_detail_controller = require('../controllers/call_for_paper_detail.controller');
router.all('/:id?', (req, res) => {
  new call_for_paper_detail_controller(req, res);
});
module.exports = router;

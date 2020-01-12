const router = require('express').Router();
const coupon_controller = require('../controllers/coupon.controller');
router.all('/:id?', (req, res) => {
  new coupon_controller(req, res);
});
module.exports = router;

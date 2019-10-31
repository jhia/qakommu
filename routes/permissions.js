const router = require('express').Router();
const permissions_controller = require('../controllers/permissions_controller');

router.all('/:id?', (req, res) => {
    new permissions_controller(req, res);
});

module.exports = router;
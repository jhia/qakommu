const router = require('express').Router();
const inputs_controller = require('../controllers/inputs_controller');

router.all('/:id?', (req, res) => {
    new inputs_controller(req, res);
});

module.exports = router;

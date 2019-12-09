const router = require('express').Router();
const inputs_data_controller = require('../controllers/inputs_data_controller');

router.all('/:id?', (req, res) => {
    new inputs_data_controller(req, res);
});

module.exports = router;

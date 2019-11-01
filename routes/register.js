const router = require('express').Router();
const register_controller = require('../controllers/register_controller');

router.all('/:id*?', (req, res) => {
    new register_controller(req, res);
});

module.exports = router;
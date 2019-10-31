const router = require('express').Router();
const login_controller = require('../controllers/login_controller');

router.all('/:id*?', (req, res) => {
    new login_controller(req, res);
});

module.exports = router;
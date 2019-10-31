const router = require('express').Router();
const users_controller = require('../controllers/users_controller');

router.all('/:id?', (req, res) => {
    new users_controller(req, res);
});

module.exports = router;
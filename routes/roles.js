const router = require('express').Router();
const roles_controller = require('../controllers/roles_controller');

router.all('/:id?', (req, res) => {
    new roles_controller(req, res);
});

module.exports = router;
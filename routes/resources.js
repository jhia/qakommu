const router = require('express').Router();
const resources_controller = require('../controllers/resources_controller');

router.all('/:id*?', (req, res) => {
    new resources_controller(req, res);
});

module.exports = router;
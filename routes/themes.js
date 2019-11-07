const router = require('express').Router();
const themes_controller = require('../controllers/themes_controller');

router.all('/:id?', (req, res) => {
    new themes_controller(req, res);
});

module.exports = router;
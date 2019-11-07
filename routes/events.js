const router = require('express').Router();
const events_controller = require('../controllers/events_controller');

router.all('/:id?', (req, res) => {
    new events_controller(req, res);
});

module.exports = router;
const router = require('express').Router();
const forms_controller = require('../controllers/forms_controller');

router.all('/:id?', (req, res) => {
    new forms_controller(req, res);
});

module.exports = router;

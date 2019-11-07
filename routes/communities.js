const router = require('express').Router();
const communities_controller = require('../controllers/communities_controller');

router.all('/:id?', (req, res) => {
    new communities_controller(req, res);
});

module.exports = router;
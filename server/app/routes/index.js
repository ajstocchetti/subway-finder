'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/stops', require('./stops.js'));
router.use('/stations', require('./stations.js'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

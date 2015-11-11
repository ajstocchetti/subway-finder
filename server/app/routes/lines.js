'use strict'
var router = require('express').Router();
module.exports = router;

var path = require('path');
var gtfs = require(path.join(__dirname, '../gtfs'));
var feed = gtfs.feed;

router.get('/', function(req, res) {
  res.send(feed.lines);
})

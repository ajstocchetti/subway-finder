'use strict'
var router = require('express').Router();
module.exports = router;

var path = require('path');
var gtfs = require(path.join(__dirname, '../gtfs'));
var feed = gtfs.feed;

router.get('/coords', function (req, res) {
  // var lat = req.body.lat;
  // var long = req.body.long;
  res.send(gtfs.find(40.709416,-74.006571));
  // res.send(feed.stops)
});

router.get('/', function(req, res) {
  res.send(feed.stops);
})

router.get('/:stopId', function(req, res) {
  var stopId = req.params.stopId;
  if(feed.stops[stopId])
    res.send(feed.stops[stopId]);
  else {
    res.sendStatus(400);
  }
})

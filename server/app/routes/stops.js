'use strict'
var router = require('express').Router();
module.exports = router;

var path = require('path');
var gtfs = require(path.join(__dirname, '../gtfs'));
var feed = gtfs.feed;

router.get('/coords', function (req, res) {
  var lat = req.body.lat;
  var long = req.body.long;
  var data = gtfs.find(req.body.lat, req.body.long);
  if (data.error){
    return res.status(400).send(data.err);
  }
  res.send(data);
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

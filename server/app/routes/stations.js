'use strict'
var router = require('express').Router();
module.exports = router;

// var geo = require('geolib');
var path = require('path')
var stops = require(path.join(__dirname,'../gtfs')).mta_static.stops;

router.get('/', function (req, res) {
  res.send(stops);
});

router.get('/:stopId', function(req, res) {
  var stopId = req.params.stopId;

  var theStop = undefined;
  for(var x=0; x<stops.length; x++) {
    if(stops[x].stop_id == stopId) {
      theStop = stops[x];
      break;
    }
  }
  if(theStop)
    res.send(theStop);
  else {
    res.sendStatus(400);
  }
});

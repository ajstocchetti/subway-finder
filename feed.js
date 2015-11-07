var config = require("./config.js");
var ProtoBuf = require('protobufjs');
var http = require('http');

var transit = ProtoBuf.protoFromFile('gtfs/nyct-subway.proto').build('transit_realtime')
var feedUrl = config.feedUrl;

function FeedWorker() {
  this.isUpdating = false;
  this.stops = {}
  this.lines = {}
  this.update();
}

FeedWorker.prototype.getLines = function() {
  return this.lines;
}
FeedWorker.prototype.getStops = function() {
  return this.stops;
}

FeedWorker.prototype.setUpdate = function(seconds) {
  seconds = seconds || 60; // default 60 second refresh
  seconds = parseInt(seconds, 10);
  if(seconds < 20) seconds = 20;
  setInterval(this.update, 1000*seconds)
}

FeedWorker.prototype.update = function() {
  if(!this.isUpdating) {
    this.isUpdating = true;
    http.get(feedUrl, function(res) {
      var dataAry = []
      res.on("data", function(d) {
        dataAry.push(d);
      });
      res.on("end", function() {
        var data = Buffer.concat(dataAry);
        var feed = transit.FeedMessage.decode(data);

        var lines = {};
        var stops = {};

        feed.entity.forEach(function(entity) {
          if(entity.trip_update) {
            var line = entity.trip_update.trip.route_id;
            var dir = entity.trip_update.trip[".nyct_trip_descriptor"].direction;
            var stu = entity.trip_update.stop_time_update;
            stu.forEach(function(update) {
              var stop_id = simpleStation(update.stop_id);
              if(update.arrival) {
                var arvl = pbTimeToUnix(update.arrival.time);
                addToLines(lines,line, dir, stop_id, arvl)
                addToStation(stops,line, dir, stop_id, arvl)
              }
            });
          }
        });
        // console.log(require('util').inspect(this.lines, false, null));
        this.stops = stops;
        this.lines = lines;
        this.isUpdating = false;
      });
    });
  }
}


module.exports = new FeedWorker;








function pbTimeToUnix(time) {
  return time.low;
}

function unixTimeReadable(time) {
  return new Date(time*1000);
}

function simpleStation(stop_id) {
  return stop_id.substring(0,3);
}


function addToLines(obj, line, dir, stop, arrival, departure) {
  obj[line] = obj[line] || {};
  obj[line][dir] = obj[line][dir] || {};
  obj[line][dir][stop] = obj[line][dir][stop] || [];
  obj[line][dir][stop].push(arrival);
}

function addToStation(obj,line, dir, stop, arrival, departure) {
  obj[stop] = obj[stop] || {};
  obj[stop][line] = obj[stop][line] || {};
  obj[stop][line][dir] = obj[stop][line][dir] || [];
  obj[stop][line][dir].push(arrival);
}

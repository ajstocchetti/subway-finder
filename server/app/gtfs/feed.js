var config = require("../../../config.js");
var path = require("path");
var ProtoBuf = require('protobufjs');
var http = require('http');
var lodash = require('lodash');

var transit = ProtoBuf.protoFromFile(path.join(__dirname, 'nyct-subway.proto')).build('transit_realtime')
var feedUrl = config.feedUrl;

function FeedWorker(timeout) {
  this.isUpdating = false;
  this.stops = {}
  this.lines = {};
  this.update();
  this.setUpdate(timeout);
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
    var self = this;
    self.isUpdating = true;
    http.get(feedUrl, function(res) {
      console.log("Updating feed"); // TODO: chalk this in some color
      var dataAry = [];
      res.on("data", function(d) {
        dataAry.push(d);
      });
      res.on("end", function() {
        try {
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
          self.stops = stops;
          self.lines = lines;
          self.isUpdating = false;
          console.log("Finished updating feed"); // TODO: chalk this
        } catch(err) {
          self.isUpdating = false;
          console.log("Feed update failed");
          console.log(err);
        }
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

// function addToLines(obj, line, dir, stop, arrival, departure) {
//   var lineIndex = -1;
//   var stopIndex = -1;
//   var dirIndex = -1;
//
//   for(var x=0; x< obj.length; x++) {
//     if(obj[x]["lineName"] == line) {
//       lineIndex = x;
//       break;
//     }
//   }
//   if(lineIndex == -1) {
//     lineIndex = obj.length;
//     obj.push({
//       lineName: line,
//       stops: []
//     });
//   }
//
//   for(var x=0; x < obj[lineIndex]["stops"].length; x++) {
//     if(obj[lineIndex]["stops"][x]["stop_id"] == stop) {
//       stopIndex = x;
//       break;
//     }
//   }
//   if( stopIndex == -1 ) {
//     stopIndex = obj[lineIndex]["stops"].length;
//     obj[lineIndex]["stops"].push({
//       stop_id: stop,
//       direction: []
//     });
//   }
//
//   for(var x=0; x<obj[lineIndex]["stops"][stopIndex]["direction"].length; x++) {
//     if(obj[lineIndex]["stops"][stopIndex]["direction"][x]["direction"] == dir) {
//       dirIndex = x;
//       break;
//     }
//   }
//   if(dirIndex == -1) {
//     dirIndex = obj[lineIndex]["stops"][stopIndex]["direction"].length;
//     obj[lineIndex]["stops"][stopIndex]["direction"].push({
//       direction: dir,
//       times: []
//     })
//   }
//
//   obj[lineIndex]["stops"][stopIndex]["direction"][dirIndex]["times"].push(arrival);
// }

// function addToLinesOld(obj, line, dir, stop, arrival, departure) {
//   obj[line] = obj[line] || {};
//   obj[line][dir] = obj[line][dir] || {};
//   obj[line][dir][stop] = obj[line][dir][stop] || [];
//   obj[line][dir][stop].push(arrival);
// }

function addToLines(obj, line, dir, stop, arrival, departure) {
  obj[line] = obj[line] || { lineName: line, stops: {} };
  obj[line]["stops"][stop] = obj[line]["stops"][stop] || { stop_id: stop, d: {} };
  obj[line]["stops"][stop]["d"][dir] = obj[line]["stops"][stop]["d"][dir] || { direction: dir, times: [] };
  obj[line]["stops"][stop]["d"][dir]["times"].push(arrival);
}

function addToStation(obj,line, dir, stop, arrival, departure) {
  obj[stop] = obj[stop] || {};
  obj[stop][line] = obj[stop][line] || {};
  obj[stop][line][dir] = obj[stop][line][dir] || [];
  obj[stop][line][dir].push(arrival);
}

var geo = require('geolib');
var mta = require('./mta-gtfs-static.js');
var feed = require('./feed.js');

function isFloat(n) {
  return isFinite(n) && n != '';
}

function validLat(n) {
  if(isFloat(n)) {
    return n <= 90 && n >= -90;
  }
  return false
}

function validLong(n) {
  if(isFloat(n)) {
    return n <= 180 && n >= -180;
  }
  return false;
}

function findDistance(lat, long, stop) {
  // assumes validation has already been done on lat and long!!!
  return geo.getDistance(
    { latitude: lat, longitude: long },
    { latitude: stop.stop_lat, longitude: stop.stop_lon },
    10
  );
}

function findClose(lat, long) {
  if(!( validLat(lat) && validLong(long) )) {
    return { error: true, err: "Invalid coordinates" };
  }
  return mta.stops.map(function(stop) {
    return {
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      distance: findDistance(lat, long, stop)
    }
  })
  .sort(function(s1,s2) {
    return s1.distance - s2.distance;
  });
}



module.exports = {
  feed: feed,
  mta_static: mta,
  find: findClose
}

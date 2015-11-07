var geo = require('geolib');


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

function findClose(lat, long, stop) {
  return geo.getDistance(
    { latitude: lat, longitude: long },
    { latitude: stop.stop_lat, longitude: stop.stop_long },
    10
  );
}

app.factory('FeedFactory', function() {
  return {
    lineAll: getLines,
    stopsAll: getStops
  };

  function getLines() {
    return $http.get('/api/lines')
      .then(function(resp) {
        return resp.data;
      })
  }

  function getStops() {
    return $http.get('/api/stops')
      .then(function(resp) {
        return resp.data;
      })
  }
})

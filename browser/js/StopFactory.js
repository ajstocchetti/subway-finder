app.factory('StopFactory', function($http) {
  return {
    all: getAll,
    get: getStop
  };
  function getAll() {
    return $http.get('/api/stations')
    .then(function(resp) {
      return resp.data;
    })
    // error handling?
  }

  function getStop(stopId) {
    return $http.get('/api/stations/' + stopId)
    .then(function(response) {
      return response.data;
    })
  }
});

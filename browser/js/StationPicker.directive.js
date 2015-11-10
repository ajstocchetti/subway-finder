app.directive('stationPicker', function(StopFactory) {
  return {
    restrict: 'E',
    templateUrl: "/views/stationPicker.dir.html",
    link: function(scope, element, attr) {
      StopFactory.all().then(function(resp) {
        scope.stations = resp;
      })
    }
  }
})

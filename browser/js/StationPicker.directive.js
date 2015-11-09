app.directive('stationPicker', function(StopFactory) {
  return {
    restrict: 'E',
    template: "{{ stations | json }}",
    link: function(scope, element, attr) {
      StopFactory.all().then(function(resp) {
        scope.stations = resp;
      })
    }
  }
})

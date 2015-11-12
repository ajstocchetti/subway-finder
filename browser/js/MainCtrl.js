app.controller('MainCtrl', ['$scope', '$interval', 'FeedFactory', 'StopFactory',
  function($scope, $interval, FeedFactory, StopFactory) {
    var update = function() {
      StopFactory.all().then(function(data) {
          $scope.stations = data;
        });
    }

    update();
    var liveUpdate = $interval(update, 180000);
    $scope.$on('$destroy', function() {
      $interval.cancel(liveUpdate);
    });

    FeedFactory.getLines().then(data => $scope.lineFeed = data);

    $scope.dirs = {
      "1" : "North",
      "2" : "East",
      "3" : "South",
      "4" : "West"
    };

}]);

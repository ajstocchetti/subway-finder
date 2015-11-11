app.controller('MainCtrl', ['$scope', 'FeedFactory', 'StopFactory',
  function($scope, FeedFactory, StopFactory) {
    StopFactory.all().then(function(data) {
        $scope.stations = data;
      });

    FeedFactory.getLines().then(data => $scope.lineFeed = data);

    $scope.dirs = {
      "1" : "North",
      "2" : "East",
      "3" : "South",
      "4" : "West"
    }

}]);

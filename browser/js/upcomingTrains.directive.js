app.directive('upcomingTrains', function(FeedFactory) {
  return {
    restrict: 'E',
    templateUrl: "/views/upcomingTrains.dir.html",
    scope: {
      selectLine = function(x) {
        scope.showme = x;
      }
      showme = 6
    }
    link: function(scope, element, attr) {
      FeedFactory.getLines()
        .then(function(data) {
          scope.lineFeed = data;
        })
    }
  }
})

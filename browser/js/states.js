app.config(function($stateProvider) {
  $stateProvider
    .state('line', {
      url: "/line/:lineNum",
      templateUrl: "/views/stationPicker.dir.html",
      controller: function($scope, lineNum) {
        $scope.activeLine = lineNum;
        $scope.lineData = $scope.lineFeed[lineNum];
      },
      resolve: {
        lineNum: function($stateParams) {
          return $stateParams.lineNum;
        }
      }
  })

  .state('line.station', {
    url: "/:stop_id",
    templateUrl: "/views/stopDetails.html",
    controller: function($scope, stop_id) {
      $scope.activeStation = stop_id;
      $scope.stationData = $scope.lineFeed[$scope.activeLine]["stops"][stop_id];
    },
    resolve: {
      stop_id: function($stateParams) {
        return $stateParams.stop_id;
      }
    }
  })
})

app.config(function($stateProvider) {
  $stateProvider
    .state('line', {
      url: "/line/:lineNum",
      templateUrl: "/views/stationPicker.dir.html",
      controller: function($scope, lineNum) {
        $scope.lineNum = lineNum;
        $scope.lineData = $scope.lineFeed[lineNum];
        $scope.stnIdToName = function(stationId) {
          for(var x=0; x<$scope.stations.length; x++) {
            if($scope.stations[x].stop_id == stationId)
              return $scope.stations[x].stop_name;
          }
        }
      },
      resolve: {
        lineNum: function($stateParams) {
          return $stateParams.lineNum;
        }
      }
  })

  .state('line.station', {
    url: "/stop_id",
    templateUrl: "/views/stopDetails.html",
    controller: function($scope, stop_id) {
      $scope.ajs = stop_id;
    },
    resolve: {
      stop_id: function($stateParams) {
        return $stateParams.stop_id;
      }
    }
  })
})

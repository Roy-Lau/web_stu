'use strict';

angular.module('app').controller('mainCtr', ['$scope', '$http', function($scope, $http) {
    $http({
        url: 'data.json',
        method: 'GET',
        dataType: 'json'
    }).success(function(data, header, config, status) {
        $scope.data = data;

        console.log($scope.data)
    }).error(function(data, header, config, status) {
        alert("处理响应失败");
    });
}])

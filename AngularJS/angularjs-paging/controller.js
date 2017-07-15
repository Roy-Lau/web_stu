'use strict';

angular.module('app').controller('mainCtr', ['$scope', '$http','datas',function($scope, $http,datas) {
    // alert(datas)
}])


angular.module('app').service('datas',['$scope', '$http', function($scope, $http) {
    // $http({
    //     url: 'data.json',
    //     method: 'GET',
    //     dataType: 'json'
    // }).success(function(data, header, config, status) {
    //  return data;

    //     // console.log($scope.data)
    // }).error(function(data, header, config, status) {
    //     alert("处理响应失败");
    // });
    return 1;
}])
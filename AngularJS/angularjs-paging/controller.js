'use strict';

angular.module('app').controller('mainCtr', ['$scope', '$http','paging',function($scope, $http,paging) {
    paging.pageFn()
}])

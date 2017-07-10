"use strict";

angular.module("app").config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$stateProvider.state('main',{
		url:'/main',
		templateUrl:'main.html',
		controller: 'mainCtr'
	});
	$urlRouterProvider.otherwise('main')
}])
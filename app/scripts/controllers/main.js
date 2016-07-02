'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MainCtrl', ['$scope','$http','Facebook','$timeout','auth',function ($scope,$http,Facebook,$timeout,auth) {
  	$scope.displayLoginModal = false;
    this.aqui = false;
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.$watch( function () { return auth.loggedUser; }, function (loggedUser) {
  	    $scope.username = loggedUser.name;
  	}, true);
	
  }]);

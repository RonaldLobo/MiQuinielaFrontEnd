'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:background
 * @description
 * # background
 */
 angular.module('miQuinielaApp')
 .directive('ads', ['$http','$rootScope','$timeout',function ($http,$rootScope,$timeout) {
 	return {
 		templateUrl: 'views/ads.html',
 		restrict: 'E',
 		controller: function($http,$scope,$rootScope,$timeout) {
 			$scope.displayBg = true;
 			$scope.currentImg = 0;
 			$scope.ads = [];
 			$scope.test = 'test';

 			var cambiaImg = function() {
 				$scope.$apply(function() {
 					if( $scope.currentImg < $scope.ads.length ) {
 						$scope.currentImg = $scope.currentImg + 1
 					} else {
 						$scope.currentImg = 0;
 					}
 				});
 				$timeout(cambiaImg, 45000);  
 			}
 			$timeout(cambiaImg, 45000);  
 			
 			$http({
 				url: $rootScope.apiUrl+"/ads.json?date="+new Date().toString(),
 				skipAuthorization: true,
 				method: 'get'
 			}).then(function(response) {
 				$scope.ads = response.data.ads;
 			});

 			$scope.goTo = function(url) {
 				window.open(url, '_system');
 			}
 		}
 	};
 }]);

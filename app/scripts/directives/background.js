'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:background
 * @description
 * # background
 */
angular.module('miQuinielaApp')
  .directive('background', function () {
    return {
      templateUrl: 'views/background.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.displayBg = true;
        scope.$on('$routeChangeStart', function(scopeTwo, next, current) { 
        	console.log('route change',scope.displayBg);
		   if(next.templateUrl == "views/index.html"){
		   		scope.displayBg = true;
		   }
		   else{
		   		scope.displayBg = false;
		   }
		});
      }
    };
  });

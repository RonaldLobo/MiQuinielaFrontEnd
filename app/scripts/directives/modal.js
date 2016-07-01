'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:modal
 * @description
 * # modal
 */
angular.module('miQuinielaApp')
  .directive('modal', function () {
    return {
        restrict: 'EA',
        templateUrl: 'views/modal.html',
        scope: {
            display: "="
        },
        transclude: true,
        link: function(scope, element, attributes){
            //display modal watch
            scope.$watch(function(){return scope.display;}, function (v) {
                if(v == true){
                    angular.element(".modal").modal('show');
                }
                else{
                    angular.element(".modal").modal('hide');
                }
            },true);

            element.bind("hide.bs.modal", function () {
                scope.display = false;
                if (!scope.$$phase && !scope.$root.$$phase)
                    scope.$apply();
            });
        },
    };
});

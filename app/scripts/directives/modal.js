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
            display: "=",
            elemento: "@"
        },
        transclude: true,
        link: function(scope, element, attributes){
            //display modal watch
            scope.$watch(function(){return scope.display;}, function (v) {
                if(v == true){
                    angular.element("#"+scope.elemento).modal('show');
                }
                else{
                    angular.element("#"+scope.elemento).modal('hide');
                    $("#"+scope.elemento).modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
            },true);

            element.bind("hide.bs.modal", function () {
                scope.display = false;
                angular.element(".collapse").removeClass('displayModalLogin');
                if (!scope.$$phase && !scope.$root.$$phase)
                    scope.$apply();
            });
        },
    };
});

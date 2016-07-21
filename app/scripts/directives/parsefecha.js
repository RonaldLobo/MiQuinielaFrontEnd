'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:parseFecha
 * @description
 * # parseFecha
 */
angular.module('miQuinielaApp')
  .directive('parseFecha', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      scope: {
            fecha: "="
      },
      link: function postLink(scope, element, attrs) {
      	var date = new Date(scope.fecha);
        var month = date.getMonth() + 1;
        element.text(date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours() + ':'+date.getMinutes());
      }
    };
  });

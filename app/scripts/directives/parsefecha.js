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
        var dateTime = scope.fecha.split(" ");
        var dateOnly = dateTime[0];
        var timeOnly = dateTime[1];

        var temp = dateOnly + "T" + timeOnly;
        function dateFromString(str) {
          var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
          return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
        }

      	var date = new Date(dateFromString(temp));
        var month = date.getMonth() + 1;
        element.text(date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours() + ':'+date.getMinutes());
      }
    };
  });

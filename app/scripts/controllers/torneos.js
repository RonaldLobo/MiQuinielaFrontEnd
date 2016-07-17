'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:TorneosCtrl
 * @description
 * # TorneosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('TorneosCtrl', ['$http','$scope','$timeout','auth','lodash',function ($http,$scope,$timeout,auth,lodash) {

    $http({
        url: "http://localhost:8012/API/index.php/torneo/",
        method: 'GET',
     }).then(function successCallback(response) {
         console.log('success',response);
         $scope.torneosUsuario = response.data.torneo;
     }, function errorCallback(response) {
         alert( "Request failed: " + response );
     });

      $scope.addTorneo = function(){
         $scope.showAgregarTorneo = true;
      }
      
      $scope.addTorneoUsuario = function(torneo) {
        var torneo = {
          "usuario": torneo
        }
      var request = $.ajax({
        url: "http://localhost:8012/API/index.php/torneo/",
        method: "POST",
        data: JSON.stringify(torneo),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        });
       };
      
      $scope.delTorneo = function(idTorneo) {
       if(auth.loggedUser.rol == 'admin'){
         $http({
          url: "http://localhost:8012/API/index.php/torneo/"+idTorneo,
          method: 'DELETE',
       }).then(function successCallback(response) {
           console.log('success',response);
          $timeout(function() {
            $scope.torneosUsuario = _.remove($scope.torneosUsuario, function(n) {
              return n.id != idTorneo;
              });
           });
       }, function errorCallback(response) {
           alert( "Request failed: " + response );
       });
        } else{
          $http({
          url: "http://localhost:8012/API/index.php/torneo/"+idTorneo,
          method: 'DELETE',
       }).then(function successCallback(response) {
           console.log('success',response);
          $timeout(function() {
            $scope.torneosUsuario = _.remove($scope.torneosUsuario, function(n) {
              return n.id != idTorneo;
              });
           });
       }, function errorCallback(response) {
           alert( "Request failed: " + response );
       });
        }

      }
      
  }]);
  
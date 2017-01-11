'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:TorneosCtrl
 * @description
 * # TorneosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('TorneosCtrl', ['$rootScope','$http','$scope','$timeout','auth','lodash',function ($rootScope,$http,$scope,$timeout,auth,lodash) {

if(auth.loggedUser.rol == 'admin'){
    ListarTorneosPorUsuarioAdmin();
   }
   else{
     ListarTorneosPorUsuario();

     ListarTorneosGlobal();
  }

    function ListarTorneosPorUsuario(){
      $http({
          url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+auth.loggedUser.id,
          method: 'GET',
       }).then(function successCallback(response) {
           console.log('success',response);
           $scope.torneosUsuario = response.data.torneo;
       }, function errorCallback(response) {
           alert( "Request failed: " + response );
       });
    } 

    function ListarTorneosPorUsuarioAdmin(){
      $http({
        url: $rootScope.apiUrl+"/API/index.php/torneo/",
        method: 'GET',
     }).then(function successCallback(response) {
         console.log('success',response);
         $scope.torneosUsuario = response.data.torneo;
     }, function errorCallback(response) {
         alert( "Request failed: " + response );
     });
     }

    function ListarTorneosGlobal(){
      $http({
        url: $rootScope.apiUrl+"/API/index.php/torneo/",
        method: 'GET',
     }).then(function successCallback(response) {
         console.log('success',response);
         $scope.torneosUsuarioGlobal = response.data.torneo;
     }, function errorCallback(response) {
         alert( "Request failed: " + response );
     });
    }

      $scope.addTorneo = function(){
        if(auth.loggedUser.rol == 'admin'){
           $scope.showAgregarTorneo = true;
        }else{
           $scope.showAgregarTorneoUsuario = true;
        }
      }
      
      $scope.addTorneoAdmin = function(torneo) {
        var torneoAdmin = {
          "torneo": {
            "torneo": torneo,
            "estado": 1
            }
        }
        if(torneo != undefined){
         $http({
           url: $rootScope.apiUrl+"/API/index.php/torneo/",
           method: 'POST',
           data: JSON.stringify(torneoAdmin)
         }).then(function successCallback(response) {
             $scope.showAgregarTorneo = false;
              $scope.torneosUsuario.push(response.data.torneoAdmin);
              ListarTorneosPorUsuarioAdmin();
             $http({
                 url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/",
                 method: 'POST',
                 data: {
                  "usuarioTorneo": {
                    "torneo": response.data.torneo.id,
                    "usuario": auth.loggedUser.id
                    }
                   }
               }).then(function successCallback(response) {
                $timeout(function() {
                });
               }, function errorCallback(response) {
                   alert( "Request failed: " + response );
               });
         }, function errorCallback(response) {
             alert( "Request failed: " + response );
         });
        }
        else{ 
          $scope.showAgregarTorneo = false;
         }
       };

       $scope.addTorneoUsuario = function(torneo) {
        var torneoUsuario = {
          "usuarioTorneo": {
            "torneo": torneo.id,
            "usuario": auth.loggedUser.id
            }
           }
           
         var validaTorneoLista = _.filter($scope.torneosUsuario,{ 'id': torneo.id }); 
         if(Object.keys(validaTorneoLista).length == 0){ 
            $http({
                 url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/",
                 method: 'POST',
                 data: {
                  "usuarioTorneo": {
                    "torneo": torneo.id,
                    "usuario": auth.loggedUser.id
                    }
                   }
               }).then(function successCallback(response) {
                   $scope.showAgregarTorneoUsuario = false;
                $timeout(function() {
                    $scope.torneosUsuario.push(response.data.torneoUsuario);
                    ListarTorneosPorUsuario();
                });
               }, function errorCallback(response) {
                   alert( "Request failed: " + response );
               });
         }else{
            $scope.showAgregarTorneoUsuario = false;
         }
       }

      $scope.delTorneo = function(idTorneo) {
       if(auth.loggedUser.rol == 'admin'){
         $http({
          url: $rootScope.apiUrl+"/API/index.php/torneo/"+idTorneo,
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
        } else {
          $http({
          url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/"+idTorneo,
          method: 'DELETE',
       }).then(function successCallback(response) {
           console.log('success',response);
          $timeout(function() {
            $scope.torneosUsuario = _.remove($scope.torneosUsuario, function(n) {
              return n.id != idTorneo;
              });
           });
       }, function errorCallback(response) {
           //alert( "Request failed: " + response );
           alert( "Error al eliminar torneo");
       });
        }
      }
      
  }]);
  
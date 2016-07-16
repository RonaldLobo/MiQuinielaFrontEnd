'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:TorneosCtrl
 * @description
 * # TorneosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('TorneosCtrl', ['$scope','lodash',function ($scope,lodash) {
    $scope.elementos = [
    	{
		     id: 1,
		     nombre: 'Torneo de Verano Costa Rica 2016',
         usurioId: 2
        },
    	{
         id : 2,
		     nombre: 'Torneo de Invierno Costa Rica 2016',
         usurioId: 2
    	},
       {
         id : 3,
		     nombre: 'Champions League',
         usurioId: 1
    	},
       {
         id : 4,
		     nombre: 'Ligue 1',
         usurioId: 1  
    	}
    ];

     $scope.torneosUsuario = _.filter($scope.elementos, function (elemento) {
       return _.includes([2], elemento.usurioId );  
    });

      $scope.addTorneo = function(){
         $scope.showAgregarTorneo = true;
      }
      
      $scope.addTorneoUsuario = function($Nombre) {
        var dataObject = {"nombre" : $Nombre,"usuarioId" : 1};  
        $scope.showAgregarTorneo = false;
        $scope.torneosUsuario.push(dataObject);
       };
      
      $scope.delTorneo = function(idTorneo) {
        $scope.torneosUsuario.splice(idTorneo,1);
      }
      
  }]);
  
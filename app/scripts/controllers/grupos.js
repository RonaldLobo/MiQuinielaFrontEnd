'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:GruposCtrl
 * @description
 * # GruposCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('GruposCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.ordenUsuarios='-puntaje';
    $scope.indexing='$index +1';
    $scope.flecha=">";
    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha===">" ? $scope.flecha="<": $scope.flecha=">";
    	$scope.ordenUsuarios==='-puntaje' ? $scope.ordenUsuarios='puntaje': $scope.ordenUsuarios='-puntaje';

    }
	$scope.usuarios={};
	$scope.grupos={};
  	var actualizaGrupos = function(){
  		console.log('called 1');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/grupos/",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		  	$scope.$apply(function() {
		  		$scope.grupos =data.grupos;
		  		console.log($scope.grupos);
		  		$scope.grupoSeleccionado=$scope.grupos[0];
		    });
		   },
    	  contentType: "application/json; charset=utf-8",
		});
  	};
  	$scope.actualizarLista = function(grupoId){

  		var request= $.ajax({
		  url: "http://localhost/API/index.php/usuarios/?userPoints="+grupoId,
		  method: "GET",
		  data: {
		      format: 'json'
		   }, 
		   dataType: 'json',
		   success: function(data) {
		  		$scope.$apply(function() {
		  			$scope.usuarios=data.usuarios;
	  			});

		   },
    	  contentType: "application/json; charset=utf-8",
		});
		      
  	};
  	actualizaGrupos();
  	$scope.actualizarLista(1);
    
  });

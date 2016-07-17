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
    $scope.flecha=">";
    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha===">" ? $scope.flecha="<": $scope.flecha=">";
    	$scope.ordenUsuarios==='-puntaje' ? $scope.ordenUsuarios='puntaje': $scope.ordenUsuarios='-puntaje';

    }
	var usuariosGrupo={};
	var usuarios={};
	var prevGrupo={};
  	var actualizaGrupos = function(){
  		console.log('called 1');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/grupos/1",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		  		prevGrupo = 
		    	{
		    		id : data.grupo.id,
					nombre : data.grupo.nombre,
				    usuarios:[]
		    	};

		   },
    	  contentType: "application/json; charset=utf-8",
		});
  	};
  	var actualizarLista = function(){

  		var request= $.ajax({
		  url: "http://localhost/API/index.php/usuarios/?userPoints=1",
		  method: "GET",
		  data: {
		      format: 'json'
		   }, 
		   dataType: 'json',
		   success: function(data) {
		  		prevGrupo.usuarios=data.usuarios;
		  		$scope.$apply(function() {
	  				$scope.grupo= prevGrupo;
	  			});
  				console.log($scope.grupo)

		   },
    	  contentType: "application/json; charset=utf-8",
		});
		      
  	};
  	actualizaGrupos();
  	actualizarLista();
    
  });

'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:GruposCtrl
 * @description
 * # GruposCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('GruposCtrl', function ($scope,auth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    //get user logged
    $scope.usuario=auth.loggedUser.id;
    /*$scope.$watch( function () { return auth.loggedUser; }, function (loggedUser) {
    	$scope.usuario = loggedUser.name;
  	}, true);*/
    var username=$scope.usuario;
    
    $scope.ordenUsuarios='-puntaje';
    $scope.flecha="Desc";
    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha==="Desc" ? $scope.flecha="Asc": $scope.flecha="Desc";
    	$scope.ordenUsuarios==='-puntaje' ? $scope.ordenUsuarios='puntaje': $scope.ordenUsuarios='-puntaje';

    }
	$scope.usuarios={};
	$scope.grupos={};
  	var actualizaGrupos = function(){
  		console.log('called 1');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/grupos/?userId="+username,
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
		  		$scope.actualizarLista($scope.grupoSeleccionado.id);
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
    
  });

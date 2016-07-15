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
    $scope.grupo = {};
	var usuariosGrupo={};
	var usuarios={};
  	$scope.actualizarLista = function(){
  		console.log('called 1');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/grupos/1",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		      	$scope.grupo.usuarios=data.usuarios;
		  		$scope.grupo = 
		    	{
		    		id : data.grupo.id,
					nombre : data.grupo.nombre,
				    usuarios:[]
		    	};

		   },
    	  contentType: "application/json; charset=utf-8",
		});
  		request = $.ajax({
		  url: "http://localhost/API/index.php/invitaciones/",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		      usuariosGrupo=data.grupos;
		      console.log(usuariosGrupo);
		   },
    	  contentType: "application/json; charset=utf-8",
		});

  		 request= $.ajax({
		  url: "http://localhost/API/index.php/usuarios/",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		     usuarios=data.usuarios;
		      console.log(usuarios);
		      console.log(usuariosGrupo.length);
  		 for (var i =0;i< usuariosGrupo.length; i++) {
  		 	console.log("loop");
  		 	if(usuariosGrupo[i].grupo==$scope.grupo.id){
  		 		console.log("ug"+usuariosGrupo[i].grupo);
  		 		for (var j = usuarios.length - 1; j >= 0; j--) {
  		 			if(usuarios[j].id==usuariosGrupo[i].usuario){
  		 				$scope.grupo.usuarios[$scope.grupo.usuarios.length]={nombre:usuarios[j].nombre,puntaje:j};
  		 			}
  		 		};
  		 	}
  		 };
		   },
    	  contentType: "application/json; charset=utf-8",
		});
		      
  	}();
    
  });

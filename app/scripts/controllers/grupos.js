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

  	var actualizaIntitaciones = function(){
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/invitaciones/",
		  method: "GET",
		  data: {
		      format: 'json'
		   },
		   dataType: 'json',
		   success: function(data) {
		      usuariosGrupo=data.grupos;
		   },
    	  contentType: "application/json; charset=utf-8",
		});
  	};
  	var actualizarLista = function(){

  		var request= $.ajax({
		  url: "http://localhost/API/index.php/usuarios/",
		  method: "GET",
		  data: {
		      format: 'json'
		   }, 
		   dataType: 'json',
		   success: function(data) {
		     usuarios=data.usuarios;
	  		 for (var i =0;i< usuariosGrupo.length; i++) {
	  		 	if(usuariosGrupo[i].grupo==prevGrupo.id){
	  		 		console.log("ug"+usuariosGrupo[i].grupo);
	  		 		for (var j = usuarios.length - 1; j >= 0; j--) {
	  		 			if(usuarios[j].id==usuariosGrupo[i].usuario){
	  		 				prevGrupo.usuarios[prevGrupo.usuarios.length]={nombre:usuarios[j].nombre,puntaje:j};
	  		 			}
	  		 		};
	  		 	} 
	  		 };
  			$scope.grupo= prevGrupo;
		   },
    	  contentType: "application/json; charset=utf-8",
		});
		      
  	};
  	actualizaGrupos();
  	actualizaIntitaciones();
  	actualizarLista();
    
  });

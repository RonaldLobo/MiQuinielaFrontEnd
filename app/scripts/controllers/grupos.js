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
    $scope.usuario=auth.loggedUser.id
    $scope.ordenUsuarios='-puntaje';
    $scope.flecha="Desc";
	$scope.usuarios={};
	$scope.grupos={};
    $scope.displayAddGrupoModal = false;
    $scope.grupoNuevo={};
    $scope.grupoNuevo.listaUsuarios=[];


    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha==="Desc" ? $scope.flecha="Asc": $scope.flecha="Desc";
    	$scope.ordenUsuarios==='-puntaje' ? $scope.ordenUsuarios='puntaje': $scope.ordenUsuarios='-puntaje';

    }
  	var actualizaGrupos = function(){
  		console.log('called 1');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/grupos/?userId="+$scope.usuario,
		  method: "GET",
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
    var cambiaMensaje=function(msg){

			$scope.error=msg;

    };
  	$scope.actualizarLista = function(grupoId){

  		var request= $.ajax({
		  url: "http://localhost/API/index.php/usuarios/?userPoints="+grupoId,
		  method: "GET",
		   dataType: 'json',
		   success: function(data) {
		  		$scope.$apply(function() {
		  			$scope.usuarios=data.usuarios;
	  			});

		   },
    	  contentType: "application/json; charset=utf-8",
		});
		      
  	};
  	$scope.agregarGrupo = function(){
    	$scope.displayAddGrupoModal = true;
    };
    $scope.agregarUsuario=function(){
    	if($scope.grupoNuevo.user!==""){
	    	var request= $.ajax({
			  url: "http://localhost/API/index.php/usuarios/?byUser="+ ($scope.grupoNuevo.user),
			  method: "GET",
			   dataType: 'json',
			   success: function(data) {
			  		$scope.$apply(function() {
			  			if(data.usuarios.usuario!=="" && $scope.usuario!==data.usuarios.id && !usuarioRepetido(data.usuarios.usuario)){
				  			$scope.grupoNuevo.listaUsuarios[$scope.grupoNuevo.listaUsuarios.length]={
				  				usuario:data.usuarios.usuario,
				  				id:data.usuarios.id,
				  				correo:data.usuarios.correo,
				  				nombre:data.usuarios.nombre+" "+data.usuarios.apellido1
				  			};
							cambiaMensaje("");
				  		}else {cambiaMensaje("Usuario invalido");}
					$scope.grupoNuevo.user="";
			  		});
			  		

			   },
	    	  contentType: "application/json; charset=utf-8",
			});
		}else{
			cambiaMensaje("Usuario vacío");
		}
    };
    var usuarioRepetido=function(user){
    	for (var i = $scope.grupoNuevo.listaUsuarios.length - 1; i >= 0; i--) {
    		if($scope.grupoNuevo.listaUsuarios[i].usuario===user){
    			return true;
    		}
    	};
    	return false;
    };
    $scope.removerUsuario=function(elemento){

    		$scope.grupoNuevo.listaUsuarios.splice(elemento,1);
    };
    $scope.crearGrupo=function(){
    	alert($scope.grupoNuevo.listaUsuarios.length);
    	
    	var request= $.ajax({
			  url: "http://localhost/API/index.php/grupos/",
			  method: "POST",
			  data: {
			      usuario:""
			   }, 
			   dataType: 'json',
			   success: function(data) {
			   	
			   },
	    	  contentType: "application/json; charset=utf-8",
			});

    	request= $.ajax({
			  url: "http://localhost/API/index.php/invitaciones/",
			  method: "POST",
			  data: {
			      usuarioGrupo: {
			      	usuario:""
			      }
			   }, 
			   dataType: 'json',
			   success: function(data) {

			   },
	    	  contentType: "application/json; charset=utf-8",
			});
    };
  	actualizaGrupos();
    
  });

'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:GruposCtrl
 * @description
 * # GruposCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('GruposCtrl', function ($scope,auth,$http) {
    //get user logged
    $scope.usuario=auth.loggedUser.id
    $scope.ordenUsuarios='position';
    $scope.flecha="Desc";
	$scope.usuarios=[];
	$scope.usuariosTodos={};
	$scope.grupos={};
    $scope.displayAddGrupoModal = false;
    $scope.grupoNuevo={};
    $scope.grupoNuevo.listaUsuarios=[];
    $scope.act={};
    $scope.act.crear="active";
    $scope.muestraTab=true;


    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha==="Desc" ? $scope.flecha="Asc": $scope.flecha="Desc";
    	$scope.ordenUsuarios==='-position' ? $scope.ordenUsuarios='position': $scope.ordenUsuarios='-position';

    }
  	var actualizaGrupos = function(){
  		$http({
		  url: "http://appquiniela.com/API/index.php/grupos/?userId="+$scope.usuario,
		  method: "GET",
		}).then(function successCallback(response) {
			$scope.grupos = response.data.grupos;
	  		if($scope.grupos.length > 0){
		  		$scope.grupoSeleccionado=$scope.grupos[0];
		  		$scope.actualizarLista($scope.grupoSeleccionado.id);
		  	}
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: "http://appquiniela.com/API/index.php/grupos/?sinUserId="+$scope.usuario,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.grupoNuevo.otrosGrupos=response.data.grupos;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	};
    var cambiaMensaje=function(msg){

			$scope.error=msg;

    };
    $scope.active=function(tab){
    	if(tab==2){
    		$scope.act.crear="";
    		$scope.act.buscar="active";
    		$scope.muestraTab=false;
    	}else{
    		$scope.act.crear="active";
    		$scope.act.buscar="";  
    		$scope.muestraTab=true;  		
    	}
    }
  	$scope.actualizarLista = function(grupoId){
  		$http({
		  url: "http://appquiniela.com/API/index.php/usuarios/?userPoints="+grupoId,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.usuarios=response.data.usuarios;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: "http://appquiniela.com/API/index.php/usuarios/?byUser="+$scope.usuario,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.usuariosTodos=response.data.usuarios;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
		      
		$http({
		  url: "http://appquiniela.com/API/index.php/torneo/",
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.torneos=response.data.torneo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	};
  	$scope.agregarGrupo = function(){
    	$scope.displayAddGrupoModal = true;
    };
    $scope.agregarUsuario=function(){
    	if(typeof($scope.grupoNuevo.user)!=="undefined" && $scope.grupoNuevo.user.usuario!=="" && $scope.grupoNuevo.user!==0){
	  		//$scope.$apply(function() {
	  			console.log($scope.grupoNuevo.user);
	  			if($scope.usuario!==$scope.grupoNuevo.user.id && !usuarioRepetido($scope.grupoNuevo.user.usuario)){
		  			$scope.grupoNuevo.listaUsuarios[$scope.grupoNuevo.listaUsuarios.length]={
		  				usuario:$scope.grupoNuevo.user.usuario,
		  				id:$scope.grupoNuevo.user.id,
		  				correo:$scope.grupoNuevo.user.correo,
		  				nombre:$scope.grupoNuevo.user.nombre+" "+$scope.grupoNuevo.user.apellido1
		  			};
					cambiaMensaje("");
		  		}else {cambiaMensaje("Usuario invalido");}
			$scope.grupoNuevo.user=0;
	  		//});			  		

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
    	if(typeof($scope.grupoNuevo.torneoSelect)!=="undefined" && $scope.grupoNuevo.name!=="" && $scope.grupoNuevo.torneoSelect.id!=="" && $scope.grupoNuevo.torneoSelect!==0){
	      	$http({
			  	url: "http://appquiniela.com/API/index.php/grupos/",
				skipAuthorization: true,
			  	method: "POST",
			  	data: {
			  		"grupo":{
			      		"idTorneo":$scope.grupoNuevo.torneoSelect.id,
			      		"idUsuario":$scope.usuario,
			      		"estado":1,
			      		"nombre":$scope.grupoNuevo.name
			  		}	

			   	}
			}).then(function(response) {
				var migrupo=response.data.grupo.id;
					$http({
					  	url: "http://appquiniela.com/API/index.php/invitaciones/",
						skipAuthorization: true,
					  	method: "POST",
					  	data: {
					  		"usuarioGrupo":{
					      		"usuario":$scope.usuario,
					      		"grupo":response.data.grupo.id,
					      		"estado":"miembro"
					  		}	

					   	}
					}).then(function(response) {
						if($scope.grupoNuevo.listaUsuarios.length>0){
							for (var i = 0; i < $scope.grupoNuevo.listaUsuarios.length; i++) {
								$http({
								  	url: "http://appquiniela.com/API/index.php/invitaciones/",
									skipAuthorization: true,
								  	method: "POST",
								  	data: {
								  		"usuarioGrupo":{
								      		"usuario":$scope.grupoNuevo.listaUsuarios[i].id,
								      		"grupo":migrupo,
								      		"estado":"invitado"
								  		}	

								   	}
								}).then(function(response) {
								   		//$scope.grupoNuevo.id=response.data.grupo.id;
										$scope.grupoNuevo.listaUsuarios={};
										actualizaGrupos();
										alert("Grupo agregado");
								   	},function(error){
										console.log('error',error.data.error.error);
										self.errorLogUp = error.data.error.error;
								});
								
							};
						}else{
							$scope.grupoNuevo.listaUsuarios={};
							actualizaGrupos();
							alert("Grupo agregado");

						}

					   	},function(error){
							console.log('error',error.data.error.error);
							self.errorLogUp = error.data.error.error;
					});
			   	},function(error){
					console.log('error',error.data.error.error);
					self.errorLogUp = error.data.error.error;
			});
			$scope.grupoNuevo.user=0;
			$scope.grupoNuevo.torneoSelect=0;
			cambiaMensaje("");
			$scope.grupoNuevo.name="";
		}else cambiaMensaje("Llenar todos los datos");
    	
    };
    $scope.unirGrupo=function(){
    	$http({
		  	url: "http://appquiniela.com/API/index.php/invitaciones/",
			skipAuthorization: true,
		  	method: "POST",
		  	data: {
		  		"usuarioGrupo":{
		      		"usuario":$scope.usuario,
		      		"grupo":$scope.grupoNuevo.grupoSelect.id,
		      		"estado":"miembro"
		  		}	

		   	}
		}).then(function(response) {
		   		//$scope.grupoNuevo.id=response.data.grupo.id;
				$scope.grupoNuevo.grupoSelect=0;
				actualizaGrupos();
				alert("Ahora estás en este grupo");
		   	},function(error){
				console.log('error',error.data.error.error);
				self.errorLogUp = error.data.error.error;
		});
    }
  	actualizaGrupos();
    
  });

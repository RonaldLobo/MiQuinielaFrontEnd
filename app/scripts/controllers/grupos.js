'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:GruposCtrl
 * @description
 * # GruposCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 250;   // always scroll by 50 extra pixels
}])

  .controller('GruposCtrl',  function ($rootScope,$scope,auth,$http, $location, $anchorScroll) {
    //get user logged
    $scope.usuarioLog=auth.loggedUser.id
    $scope.ordenUsuarios='position';
    $scope.flecha="Desc";
	$scope.usuarios=[];
	$scope.usuariosTodos={};
	$scope.grupos={};
	$scope.partidos={};
	$scope.jornadas={};
    $scope.displayAddGrupoModal = false;
    $scope.displayPredGrupoModal = false;
    $scope.grupoNuevo={};
    $scope.grupoNuevo.listaUsuarios=[];
    $scope.act={};
    $scope.grupoNuevo.otrosGrupos=[];
    $scope.predicciones={};
    $scope.act.crear="active";
    $scope.muestraTab=true;


    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha==="Desc" ? $scope.flecha="Asc": $scope.flecha="Desc";
    	$scope.ordenUsuarios==='-position' ? $scope.ordenUsuarios='position': $scope.ordenUsuarios='-position';

    }
  	var actualizaGrupos = function(){
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/grupos/?userId="+$scope.usuarioLog,
		  method: "GET",
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
			$scope.grupos = response.data.grupos;
	  		if($scope.grupos.length > 0){
		  		$scope.grupoSeleccionado=$scope.grupos[0];
		  		$scope.actualizarLista($scope.grupoSeleccionado.id);
		  	}

		}, function errorCallback(response) {
            $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

  	};
  	$scope.actualizaJornadas = function(idTorneo){
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/partidos/?torneo="+idTorneo,
		  method: "GET",
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
			$scope.partidos = response.data.partido;
		}, function errorCallback(response) {
            $rootScope.isLoading = false;
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
    	cambiaMensaje("");
    }
  	$scope.actualizarLista = function(grupoId, jornada){
		$scope.actualizaJornadas($scope.grupoSeleccionado.idTorneo);
  		if(jornada==undefined)jornada=0;
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/usuarios/?userPoints="+grupoId+"&jornada="+jornada,
		  method: "GET"
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
	  		$scope.usuarios=response.data.usuarios;
		}, function errorCallback(response) {
            $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: $rootScope.apiUrl+"/API/index.php/usuarios/?byUser="+$scope.usuarioLog,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.usuariosTodos=response.data.usuarios;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
		$scope.grupoNuevo.otrosGrupos=[]; 
		$http({
		  url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+$scope.usuarioLog,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.torneos=response.data.torneo;
			for (var i = 0; i < $scope.torneos.length; i++) {
				$http({
				  url: $rootScope.apiUrl+"/API/index.php/grupos/?sinUserId="+$scope.usuarioLog+"&torneo="+$scope.torneos[i].id,
				  method: "GET"
				}).then(function successCallback(response) {
			  		$scope.grupoNuevo.otrosGrupos.splice.apply($scope.grupoNuevo.otrosGrupos, [response.data.grupos.length, 0].concat(response.data.grupos));
				}, function errorCallback(response) {
				    if(response.status == 401){
				    	auth.logOut();
				    }
				});
			};
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
	  			if($scope.usuarioLog!==$scope.grupoNuevo.user.id && !usuarioRepetido($scope.grupoNuevo.user.usuario)){
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
			  	url: $rootScope.apiUrl+"/API/index.php/grupos/",
				skipAuthorization: true,
			  	method: "POST",
			  	data: {
			  		"grupo":{
			      		"idTorneo":$scope.grupoNuevo.torneoSelect.id,
			      		"idUsuario":$scope.usuarioLog,
			      		"estado":1,
			      		"nombre":$scope.grupoNuevo.name
			  		}	

			   	}
			}).then(function(response) {
				var migrupo=response.data.grupo.id;
					$http({
					  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
						skipAuthorization: true,
					  	method: "POST",
					  	data: {
					  		"usuarioGrupo":{
					      		"usuario":$scope.usuarioLog,
					      		"grupo":response.data.grupo.id,
					      		"estado":"miembro"
					  		}	

					   	}
					}).then(function(response) {
						if($scope.grupoNuevo.listaUsuarios.length>0){
							for (var i = 0; i < $scope.grupoNuevo.listaUsuarios.length; i++) {
								$http({
								  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
									skipAuthorization: true,
								  	method: "POST",
								  	data: {
								  		"usuarioGrupo":{
								      		"usuario":$scope.grupoNuevo.listaUsuarios[i].id,
								      		"grupo":migrupo,
								      		"estado":"miembro"
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
    	console.log($scope.grupoNuevo.grupoSelect);
    	if($scope.grupoNuevo.grupoSelect!==0 && typeof($scope.grupoNuevo.grupoSelect)!=="undefined"){
	    	$http({
			  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
				skipAuthorization: true,
			  	method: "POST",
			  	data: {
			  		"usuarioGrupo":{
			      		"usuario":$scope.usuarioLog,
			      		"grupo":$scope.grupoNuevo.grupoSelect.id,
			      		"estado":"miembro"
			  		}	

			   	}
			}).then(function(response) {
			   		//$scope.grupoNuevo.id=response.data.grupo.id;
					$scope.grupoNuevo.grupoSelect=0;
					actualizaGrupos();
					alert("Ahora estás en este grupo");
					cambiaMensaje("");
			   	},function(error){
					console.log('error',error.data.error.error);
					self.errorLogUp = error.data.error.error;
			});
		}else cambiaMensaje("No ha seleccionado ningún Grupo");
	  }
	  $scope.gotoBottom = function() {
	      // set the location.hash to the id of
	      // the element you wish to scroll to.
	      
    		  var old = $location.hash();
		      $location.hash('pos-'+$scope.usuarioLog);

		      // call $anchorScroll()
		      $anchorScroll();
   			  $location.hash(old);
	    };
	    $scope.muestraPredicciones=function(userId){

    		$scope.displayPredGrupoModal = true;
            $rootScope.isLoading = true;
	    	//alert($scope.grupoSeleccionado.idTorneo);
	    	$http({
				  url: $rootScope.apiUrl+"/API/index.php/usuarios/"+userId,
				  method: 'GET',
				}).then(function successCallback(response) {
                    $rootScope.isLoading = false;
				    $scope.predicciones.user=response.data.usuario;
				}, function errorCallback(response) {
                    $rootScope.isLoading = false;
				});
	    	$http({
				  url: $rootScope.apiUrl+"/API/index.php/predicciones/?userId="+userId+'&torneoId='+$scope.grupoSeleccionado.idTorneo,
				  method: 'GET',
				}).then(function successCallback(response) {
				    $scope.predicciones.userPredictions=response.data.predicciones;
				}, function errorCallback(response) {
				});
	    }

	  actualizaGrupos();
    
  });

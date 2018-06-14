'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the miQuinielaApp
 */
 angular.module('miQuinielaApp')
 .controller('ConfiguracionCtrl', function ($rootScope,$scope,auth,$http,Facebook) {
    $scope.usuario = auth.loggedUser; // Usuario logeado
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

    $scope.actualizarUsuario = function(){
    	actualizarUsuario($scope.usuario);
    };

    function actualizarUsuario(usuario) {
    	var usuario = {
    		"usuario": usuario
    	}
    	$rootScope.isLoading = true;
    	$http({
    		url: $rootScope.apiUrl+"/API/index.php/usuarios/?method=PUT",
    		method: "POST",
    		data: usuario
    	}).then(function successCallback(response) {
    		$rootScope.isLoading = false;
    		$scope.usuario = response.data.usuario;
    		localStorage.setItem('usuario', JSON.stringify($scope.usuario)); 
    		auth.logOut();
    	}, function errorCallback(response) {
    		$rootScope.isLoading = false;
    		if(response.status == 401){
    			auth.logOut();
    		}
    	});
    }

    $scope.aceptarInvitacion = function(id){
    	$rootScope.isLoading = true;
    	$http({
    		url: $rootScope.apiUrl+"/API/index.php/invitaciones/?id="+id+"&method=PUT",
    		method: "POST",
    		dataType: "text"
    	}).then(function successCallback(response) {
    		$rootScope.isLoading = false;
    		$scope.$apply(function() {
    			$scope.invitaciones = _.remove($scope.invitaciones, function(n) {
    				console.log(n,n.id, n.id == id);
    				return n.id != id;
    			});
    		});
    	}, function errorCallback(response) {
    		$rootScope.isLoading = false;
    		if(response.status == 401){
    			auth.logOut();
    		}
    	});
    }

    $scope.cancelarUsuario = function(){
    	$scope.usuario = JSON.parse(localStorage.getItem('usuario'));
    }

    $scope.integrarFb = function(){
        if(app){
            window.facebookConnectPlugin.getLoginStatus((success)=>{
                if(success.status === 'connected'){
                    updateMeFb();
                } else {
                    window.facebookConnectPlugin.login(['email','public_profile'],(response) => {
                        updateMeFb();
                    },(error)=>{
                        console.log('error get user info ' + JSON.stringify(error));
                    });
                }
            },(error)=> {
                console.log('error check status');
                console.log(error);
            });
        } else {
        	Facebook.login(function(response) {
        		if (response.status == 'connected') {
        			updateMeFb();
        		}
        	});
        }
    }

    function updateMeFb(){
        if(app){
            window.facebookConnectPlugin.api("/me?fields=email,first_name,last_name,picture", null,(response)=>{
                console.log('response',response);
                let fbUser = $scope.usuario;
                fbUser.usuario = response.id
                fbUser.nombre = response.first_name;
                fbUser.apellido1 = response.last_name.split(' ')[0];
                if(response.last_name.split(' ').length > 1){
                    fbUser.apellido2 = response.last_name.split(' ')[1]
                }
                fbUser.contrasenna = 'facebook';
                fbUser.tipo = 'fb';
                actualizarUsuario(fbUser);
            });
        } else {
            Facebook.api('/me?fields=email,first_name,last_name,picture', function(response) {
                console.log('response',response);
                let fbUser = $scope.usuario;
                fbUser.usuario = response.id
                fbUser.nombre = response.first_name;
                fbUser.apellido1 = response.last_name.split(' ')[0];
                if(response.last_name.split(' ').length > 1){
                    fbUser.apellido2 = response.last_name.split(' ')[1]
                }
                fbUser.contrasenna = 'facebook';
                fbUser.tipo = 'fb';
                actualizarUsuario(fbUser);
            });
        }
    }

    function obtenerInvitaciones(id){
    	$http({
    		url: $rootScope.apiUrl+"/API/index.php/invitaciones/"+id,
    		method: "GET",
    	}).then(function successCallback(response) {
    		$scope.invitaciones = response.data.grupos;
    	}, function errorCallback(response) {
    		if(response.status == 401){
    			auth.logOut();
    		}
    	});
    }

    function init(){
    	obtenerInvitaciones(auth.loggedUser.id);
    }

    init();
});

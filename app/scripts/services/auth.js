'use strict';

/**
 * @ngdoc service
 * @name miQuinielaApp.auth
 * @description
 * # auth
 * Service in the miQuinielaApp.
 */
angular.module('miQuinielaApp')
  .service('auth', ['$rootScope','$http','$location','Facebook',function ($rootScope,$http,$location,Facebook) {
  	// public variables
  	this.loggedUser = {};
  	this.isAuthenticated = false,
  	this.isFacebookAuth = false,
  	this.app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

  	//private variables

  	this.regularLogin = function(user){
  		var self = this;
  		if(user.username && user.password){
	      	$http({
				url: $rootScope.apiUrl+"/API/index.php/login?XDEBUG_SESSION_START=netbeans-xdebug",
				skipAuthorization: true,
				method: 'POST',
				data: {
					usuario: user.username,
					contrasenna: user.password,
					tipo: "normal"
				}
			}).then(function(response) {
                console.log('got response',response);
				if(response.data.error){
					self.error = response.data.error.error;
				}
				else{
					self.isFacebookAuth = false;
					localStorage.setItem('JWT', response.data.auth.token);
					localStorage.setItem('usuarioId', response.data.auth.user.id);
					localStorage.setItem('isFacebookAuth', false);
					self.loggedUser = response.data.auth.user;
					localStorage.setItem('usuario', JSON.stringify(self.loggedUser));	
					self.isAuthenticated = true;
					self.error = null;
                    console.log('va a traer torneos');
					$http({
                      url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+response.data.auth.user.id,
                      method: 'GET',
                    }).then(function successCallback(response) {
                       //console.log('success',response);
                       //$scope.torneos = true;
                       var torneosUsuario = response.data.torneo;
                       if (torneosUsuario.length<=0) {
                        $location.path("/torneos");
                       }else{
                       		$location.path('/home');
                       }
                       console.log("sirve y son "+torneosUsuario.length)
                   }, function errorCallback(response) {
                       alert( "Request failed: " + response );
                   });
				}
			},function(error){
				self.error = error.data.error.error;
			});
		}
  	};
  	this.agregarEmailNuevo = function(){
	    	var email = {
	    		email: {
		    		"mail":""
		    	},
	    	};
	    	$http({
			  url: $rootScope.apiUrl+"/API/index.php/email/",
			   data: email,
			  method: 'POST',
			}).then(function successCallback(response) {
			    $scope.email={};
			}, function errorCallback(response) {
			    if(response.status == 401){
			    	auth.logOut();
			    }
			});
    };
  	this.regularLogup = function(user){
  		var self = this;
  		if(user.username && user.password){
  			var usuario = {
  				"usuario":{
  					"usuario": user.username,
					"contrasenna": user.password,
					"tipo": "normal",
					"apellido1": user.apellido,
					"correo": user.correo,
					"nombre": user.nombre
  				}
  			}
	      	$http({
				url: $rootScope.apiUrl+"/API/index.php/signup",
				skipAuthorization: true,
				method: 'POST',
				data: usuario
			}).then(function(response) {
				if(response.data.error){
					self.errorLogUp = response.data.error.error;
				}
				else{
					self.isFacebookAuth = false;
					localStorage.setItem('JWT', response.data.auth.token);
					localStorage.setItem('usuarioId', response.data.auth.user.id);
					localStorage.setItem('isFacebookAuth', false);
					self.loggedUser = response.data.auth.user;
					localStorage.setItem('usuario', JSON.stringify(self.loggedUser));	
					self.isAuthenticated = true;
					self.errorLogUp = null;
					$http({
                      url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+response.data.auth.user.id,
                      method: 'GET',
                   }).then(function successCallback(response) {
                       //console.log('success',response);
                       //$scope.torneos = true;

                       var torneosUsuario = response.data.torneo;
                       var email = {
				    		email: {
					    		"user":user.correo,
					    		"name":user.nombre,
					    		"username":user.username,
					    		"pass":user.password
					    	},
				    	};
				    	$http({
						  url: $rootScope.apiUrl+"/API/index.php/email/",
						   data: email,
						  method: 'POST',
						}).then(function successCallback(response) {
						    $scope.email={};

						}, function errorCallback(response) {
						    if(response.status == 401){
						    	auth.logOut();
						    }
						});
                       console.log("sirve y son "+torneosUsuario.length);
		                $location.path("/torneos");
                   }, function errorCallback(response) {
                       alert( "Request failed: " + response );
                   });
				}
			},function(error){
				console.log('error',error.data.error.error);
				self.errorLogUp = error.data.error.error;
			});
		}
  	};

  	this.fbLoginUp = function(user){
  		console.log('va fb logup',user);
  		var stringArray = user.name.split(/(\s+)/);
  		console.log(stringArray);
  		var self = this;
  		var usuario = {
			"usuario":{
				"usuario": user.id,
				"contrasenna": null,
				"tipo": "fb",
				"apellido1": stringArray[1],
				"correo": null,
				"nombre": stringArray[0]
			}
		}
  		if(user.id){
	      	$http({
				url: $rootScope.apiUrl+"/API/index.php/signup",
				skipAuthorization: true,
				method: 'POST',
				data: usuario
			}).then(function(response) {
				self.isFacebookAuth = true;
				localStorage.setItem('JWT', response.data.auth.token);
				localStorage.setItem('usuarioId', response.data.auth.user.id);
				localStorage.setItem('isFacebookAuth', true);
				self.loggedUser = response.data.auth.user;
				localStorage.setItem('usuario', JSON.stringify(self.loggedUser));
				self.isAuthenticated = true;
				self.error = null;
				$location.path('/home');
			},function(error){
				self.error = error.data.error.error;
			});
		}
  	}

  	this.fbLogin = function(user){
  		var self = this;
  		console.log('user',user);
  		var fbUser = {};
  		fbUser.usuario = user.id
  		fbUser.nombre = user.first_name;
        fbUser.apellido1 = user.last_name.split(' ')[0];
        if(user.last_name.split(' ').length > 1){
            fbUser.apellido2 = user.last_name.split(' ')[1]
        }
        fbUser.contrasenna = 'facebook';
        fbUser.tipo = 'fb';
  		if(user.id){
	      	$http({
				url: $rootScope.apiUrl+"/API/index.php/login",
				skipAuthorization: true,
				method: 'POST',
				data: fbUser
			}).then(function(response) {
				self.isFacebookAuth = true;
				localStorage.setItem('JWT', response.data.auth.token);
				localStorage.setItem('usuarioId', response.data.auth.user.id);
				localStorage.setItem('isFacebookAuth', true);
				self.loggedUser = response.data.auth.user;
				localStorage.setItem('usuario', JSON.stringify(self.loggedUser));
				self.isAuthenticated = true;
				self.error = null;
				$location.path('/home');
			},function(error){
				self.error = error.data.error.error;
			});
		}
  	}

  	this.checkForLogin = function(){
  		if(localStorage.getItem('JWT')){
  			this.loggedUser = JSON.parse(localStorage.getItem('usuario'));
  			this.isFacebookAuth = localStorage.getItem('isFacebookAuth');
  			if(this.isFacebookAuth){
  				// $rootScope.$apply(function() {
  					setTimeout(function(){ 
  						if(app){
  							window.facebookConnectPlugin.getLoginStatus((success)=>{
				                if(success.status === 'connected'){
				                } else {
				                    window.facebookConnectPlugin.login(['email','public_profile'],(response) => {
				                    	
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
					    		console.log('logged fb');
					    	});
			    		}
				    }, 3000);
	    		// });
  				
  			}
  			this.isAuthenticated = true;
  			return false;
  		}
  		if($location.path() == "/") return false;
  		return true;
  	}

  	this.logOut = function(){
  		localStorage.removeItem('JWT');
		localStorage.removeItem('usuarioId');
		localStorage.removeItem('userFbId');
		localStorage.removeItem('usuario');
		localStorage.removeItem('isFacebookAuth');
		this.isFacebookAuth = false;
		this.loggedUser = {};
		this.loggedUser.fbId = '';
		this.isAuthenticated = false;
		$location.path('/');
  	}

  	return this;





  }]);

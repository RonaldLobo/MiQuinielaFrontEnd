'use strict';

/**
 * @ngdoc service
 * @name miQuinielaApp.auth
 * @description
 * # auth
 * Service in the miQuinielaApp.
 */
angular.module('miQuinielaApp')
  .service('auth', ['$http','$location',function ($http,$location) {
  	// public variables
  	this.loggedUser = {};
  	this.isAuthenticated = false,
  	this.isFacebookAuth = false,

  	//private variables

  	this.regularLogin = function(user){
  		var self = this;
  		if(user.username && user.password){
	      	$http({
				url: 'http://appquiniela.com/API/index.php/login',
				skipAuthorization: true,
				method: 'POST',
				data: {
					usuario: user.username,
					contrasenna: user.password,
					tipo: "normal"
				}
			}).then(function(response) {
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
					$location.path('/home');
				}
			},function(error){
				self.error = error.data.error.error;
			});
		}
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
				url: 'http://appquiniela.com/API/index.php/signup',
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
					$location.path('/home');
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
				url: 'http://appquiniela.com/API/index.php/signup',
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
  		if(user.id){
	      	$http({
				url: 'http://appquiniela.com/API/index.php/login?XDEBUG_SESSION_START=netbeans-xdebug',
				skipAuthorization: true,
				method: 'POST',
				data: {
					usuario: user.id,
					contrasenna: "",
					tipo: "fb"
				}
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

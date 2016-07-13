'use strict';

/**
 * @ngdoc service
 * @name miQuinielaApp.auth
 * @description
 * # auth
 * Service in the miQuinielaApp.
 */
angular.module('miQuinielaApp')
  .service('auth', ['$http',function ($http) {
  	// public variables
  	this.loggedUser = {};
  	this.isAuthenticated = false,
  	this.isFacebookAuth = false,

  	//private variables

  	this.regularLogin = function(user){
  		var self = this;
  		if(user.username && user.password){
	      	$http({
				url: 'http://localhost/API/index.php/login',
				skipAuthorization: true,
				method: 'POST',
				data: {
					usuario: user.username,
					contrasenna: user.password,
					tipo: "normal"
				}
			}).then(function(response) {
				self.isFacebookAuth = false;
				localStorage.setItem('JWT', response.data.auth.token);
				localStorage.setItem('usuarioId', response.data.auth.user.id);
				localStorage.setItem('isFacebookAuth', false);
				self.loggedUser = response.data.auth.user;
				localStorage.setItem('usuario', JSON.stringify(self.loggedUser));	
				self.isAuthenticated = true;
			});
		}
  	};

  	this.fbLogin = function(user){
  		var self = this;
  		if(user.id){
	      	$http({
				url: '/API/index.php/login',
				skipAuthorization: true,
				method: 'POST',
				data: {
					username: user.id,
					password: "",
					type: "fb"
				}
			}).then(function(response) {
				self.isFacebookAuth = true;
				self.loggedUser.name = user.name;
				self.loggedUser.id = '1';
				self.loggedUser.fbId = user.id;
				localStorage.setItem('JWT', response.data.auth.token);
				localStorage.setItem('usuarioId', '1');
				localStorage.setItem('userFbId', user.id);
				localStorage.setItem('userName', user.name);
				localStorage.setItem('isFacebookAuth', true);
				self.isAuthenticated = true;
			});
		}
  	}

  	this.checkForLogin = function(){
  		if(localStorage.getItem('JWT')){
  			this.loggedUser = JSON.parse(localStorage.getItem('usuario'));
  			if(localStorage.getItem('isFacebookAuth') == true){
  				this.isFacebookAuth = true;
  				this.loggedUser.fbId = localStorage.getItem('userFbId');
  			}
  			else{
  				this.isFacebookAuth = false;
  			}
  			this.isAuthenticated = true;
  			return false;
  		}
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
  	}

  	return this;





  }]);

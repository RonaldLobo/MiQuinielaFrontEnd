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
				url: 'http://localhost/api/login',
				skipAuthorization: true,
				method: 'POST',
				data: {
					username: user.username,
					password: user.password,
					type: "normal"
				}
			}).then(function(response) {
				self.loggedUser.name = user.username;
				self.loggedUser.id = '1';
				self.isFacebookAuth = false;
				localStorage.setItem('JWT', response.data.auth.token);
				localStorage.setItem('userId', '1');
				localStorage.setItem('userName', user.username);
				localStorage.setItem('isFacebookAuth', false);
				self.isAuthenticated = true;
			});
		}
  	};

  	this.fbLogin = function(user){
  		var self = this;
  		if(user.id){
	      	$http({
				url: 'http://localhost/api/login',
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
				localStorage.setItem('userId', '1');
				localStorage.setItem('userFbId', user.id);
				localStorage.setItem('userName', user.name);
				localStorage.setItem('isFacebookAuth', true);
				self.isAuthenticated = true;
			});
		}
  	}

  	this.checkForLogin = function(){
  		if(localStorage.getItem('JWT')){
  			this.loggedUser.id = localStorage.getItem('userId');
  			this.loggedUser.name = localStorage.getItem('userName');
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
		localStorage.removeItem('userId');
		localStorage.removeItem('userFbId');
		localStorage.removeItem('userName');
		localStorage.removeItem('isFacebookAuth');
		this.isFacebookAuth = false;
		this.loggedUser.name = '';
		this.loggedUser.id = '';
		this.loggedUser.fbId = '';
		this.isAuthenticated = false;
  	}

  	return this;





  }]);

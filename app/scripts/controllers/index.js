'use strict';

/**
* @ngdoc function
* @name miQuinielaApp.controller:HomeCtrl
* @description
* # HomeCtrl
* Controller of the miQuinielaApp
*/
angular.module('miQuinielaApp')
.controller('indexCtrl',['$http','$scope','$rootScope','auth','$location',function ($http,$scope,$rootScope,auth,$location) {
	//Private
	var self = this;
	self.user = {};
	var userIsConnected = false;
	//Public
	$scope.user = auth.loggedUser;
	$scope.tipoApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	$scope.activeLink = true;

	//Watch
	$scope.$watch(function(){return auth.isAuthenticated;}, function (v) {
		$scope.isAuthenticated = v;
		if(v == true){
			$scope.user = auth.loggedUser;
			$scope.visible = true;
			$scope.displayLogUpModal = false;
			$location.path("/misjuegos");
		}
		if(v == false){
			$scope.visible = false;
		}
	},true);

	$scope.$watch(function(){return auth.error;}, function (v) {
		$scope.error = auth.error;
	},true);

	$scope.$watch(function(){return auth.errorLogUp;}, function (v) {
		$scope.errorLogUp = auth.errorLogUp;
	},true);

	//Actions
	$scope.regularLogin = function(user){
		if(user){
			auth.regularLogin(user);
		}
	}

	$scope.regularLogup = function(user){
		if(user){
			if(user.password == user.confirmPassword){
				$scope.logupError = null
				delete user.confirmPassword;
				auth.regularLogup(user);
			}
			else{
				$scope.logupError = "Por favor confirme su contraseña";
			}
		}
		else{
			$scope.logupError = "Por favor ingrese un usuario";
		}
	}

	$scope.showLogin = function(){
		$scope.displayLoginModal = true;
	}

	$scope.showLogup = function(){
		$scope.displayLogUpModal = true;
	}

	$scope.logoutBoth = function(){
		if($scope.isFacebookAuth){
			this.logout();
		}
		else{
			auth.logOut();
		}
	}

	function isAuth(){
		if(auth.isAuthenticated == false){
			var needsToLog = auth.checkForLogin();
			if(needsToLog){
				$scope.displayLoginModal = true;
				$scope.visible = false;
			}
			else{
				$scope.visible = true;
			}
		}
	}

	function init(){
		isAuth();
	}

	init();



}]);

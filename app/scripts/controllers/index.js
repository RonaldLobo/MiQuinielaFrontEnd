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
  	// $('.btn-navbar').click(); //bootstrap 2.x
   //  $('.navbar-toggle').click() //bootstrap 3.x by Richard

  	var self = this;
	$scope.user = {};
    function ListarTorneosPorUsuario(){
                  $http({
                      url: "http://appquiniela.com/API/index.php/torneo/?usuario="+auth.loggedUser.id,
                      method: 'GET',
                   }).then(function successCallback(response) {
                       //console.log('success',response);
                       //$scope.torneos = true;
                       $scope.torneosUsuario = response.data.torneo;
                       if ($scope.torneosUsuario.length<=0) {
                        $location.path("/torneos");
                       };
                   }, function errorCallback(response) {
                       alert( "Request failed: " + response );
                   });
                }
                ListarTorneosPorUsuario();
	if(auth.isAuthenticated == false){
		var needsToLog = auth.checkForLogin();
		if(needsToLog){
			$scope.displayLoginModal = true;
			$scope.visible = false;
			angular.element(".collapse").addClass('displayModalLogin');
		}
		else{
			$scope.visible = true;
		}
	}
	$scope.user = auth.loggedUser;

	$scope.$watch(function(){return auth.isAuthenticated;}, function (v) {
		$scope.isAuthenticated = v;
		if(v == true && $scope.displayLoginModal == true){
			$scope.displayLoginModal = false;
			angular.element(".collapse").removeClass('displayModalLogin');
		}
		if(v == true){
			$scope.user = auth.loggedUser;
			$scope.visible = true;
			$scope.displayLogUpModal = false;
		}
		if(auth.isFacebookAuth){
			$scope.isFacebookAuth = auth.isFacebookAuth;
		}
		if(v == false){
			$scope.visible = false;
		}
    },true);

    $scope.$watch(function(){return auth.isFacebookAuth;}, function (v) {
		$scope.isFacebookAuth = auth.isFacebookAuth;
    },true);

    $scope.$watch(function(){return auth.error;}, function (v) {
    	console.log('changed',auth.error);	
		$scope.error = auth.error;
    },true);

    $scope.$watch(function(){return auth.errorLogUp;}, function (v) {
		$scope.errorLogUp = auth.errorLogUp;
    },true);
    

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
        ListarTorneosPorUsuario();
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

    $scope.activeLink = true;
    $scope.$on('$routeChangeSuccess', function(locationPath) {
    	var isSecondexpanded = $("#js-navbar-collapse-second").attr("aria-expanded");
        var isFirstExpanded = $("#js-navbar-collapse").attr("aria-expanded");
        if(isSecondexpanded == "true"){
            $('.second-collapse').click();
        }
        if(isFirstExpanded == "true"){
            console.log('expand menu 2');
            $('.first-collapse').click();
        }
    	$scope.home = false;
    	$scope.torneos = false;
    	$scope.foro = false;
    	$scope.grupos = false;
    	$scope.configuracion = false;
        switch($location.path()){
        	case "/home": 
        		$scope.home = true;
        		break;
        	case "/torneos": 
        		$scope.torneos = true;
        		break;
        	case "/grupos": 
        		$scope.grupos = true;
        		break;
        	case "/configuracion": 
        		$scope.configuracion = true;
        		break;
        }
    });


    //-------------------------------------------//
    //login


	// Define user empty data :/
	this.user = {};

	var userIsConnected = false;

	$scope.logout = function() {
		auth.logOut();
	}



  }]);

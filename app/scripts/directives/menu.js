angular.module('miQuinielaApp').directive('ngMenu', ['$http','$location','auth','Facebook','$timeout','$rootScope',function () { 'use strict';

        return {
            restrict: 'A',
            templateUrl: 'views/menu.html',
            controller: function ($http,$scope,$location,auth,Facebook,$timeout,$rootScope) {

            	var self = this;
            	$scope.user = {};
				this.user = {};
            	var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

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
			    }

			    $scope.showLogin = function(){
			    	console.log('displayLogin');
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
                	$scope.tablas = false;
                	$scope.jugar = false;
                	$scope.configuracion = false;
	                switch($location.path()){
	                	case "/home": 
	                		$scope.home = true;
	                		break;
	                	case "/torneos": 
	                		$scope.torneos = true;
	                		break;
	                	case "/jugar": 
	                		$scope.jugar = true;
	                		break;
	                	case "/tablas": 
	                		$scope.tablas = true;
	                		break;
	                	case "/configuracion": 
	                		$scope.configuracion = true;
	                		break;
	                }
	            });

				$scope.$watch(
					function() {
					  return Facebook.isReady();
					},
					function(newVal) {
					  if (newVal)
					    $scope.facebookReady = true;
					}
				);

				var userIsConnected = false;

				Facebook.getLoginStatus(function(response) {
					if (response.status == 'connected') {
					  userIsConnected = true;
					}
				});

				$scope.IntentLogin = function() {
					$scope.login();
				};

				$scope.IntentLoginUp = function() {
					$scope.login();
				};

				$scope.login = function() {
					if(app){
						window.facebookConnectPlugin.getLoginStatus((success)=>{
			                if(success.status === 'connected'){
			                    $scope.me();
			                } else {
			                    window.facebookConnectPlugin.login(['email','public_profile'],(response) => {
		                            $scope.me();
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
								$scope.logged = true;
								$scope.me();
							}
						});
					}
				};

				$scope.me = function() {
					if(app){
						window.facebookConnectPlugin.api("/me?fields=email,first_name,last_name,picture", null,(res)=>{
						    $scope.$apply(function() {
						    	$scope.user = res;
						    	auth.fbLogin(res);
						    });
				        },(error)=>{
				            console.log('error get user info ' + JSON.stringify(error));
				        });
					} else {
						Facebook.api('/me?fields=email,first_name,last_name,picture', function(response) {
							$scope.$apply(function() {
							  $scope.user = response;
							  auth.fbLogin(response);
							});
						});
					}
				};

				$scope.logout = function() {
					if(this.isApp){
			            window.facebookConnectPlugin.logout((success) => {
			                console.log('success logout');
			            }, (failure) => {
			                console.log('fail login');
			            });
			        } else {
						Facebook.logout(function() {
						  $scope.$apply(function() {
						    $scope.user   = {};
						    $scope.logged = false;  
						  });
						});
			        }
			        auth.logOut();
				}
            }
        };
    }]);
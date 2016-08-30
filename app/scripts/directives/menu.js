angular.module('miQuinielaApp').directive('ngMenu', ['$http','$location','auth','Facebook','$timeout','$rootScope',function () { 'use strict';

        return {
            restrict: 'A',
            templateUrl: 'views/menu.html',
            controller: function ($http,$scope,$location,auth,Facebook,$timeout,$rootScope) {

            	var self = this;
            	$scope.user = {};

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
            	$scope.torneosUsuario={};	
	            function ListarTorneosPorUsuario(){
			      $http({
			          url: "http://appquiniela.com/API/index.php/torneo/?usuario="+auth.loggedUser.id,
			          method: 'GET',
			       }).then(function successCallback(response) {
			           //console.log('success',response);
			           //$scope.torneos = true;
			           $scope.torneosUsuario = response.data.torneo;
			       }, function errorCallback(response) {
			           alert( "Request failed: " + response );
			       });
			    }
			    ListarTorneosPorUsuario();
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

				/**
				* Watch for Facebook to be ready.
				* There's also the event that could be used
				*/
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

				/**
				* IntentLogin
				*/
				$scope.IntentLogin = function() {
					//if(!userIsConnected) {
					  $scope.login();
					//}
				};

				$scope.IntentLoginUp = function() {
					//if(!userIsConnected) {
						Facebook.login(function(response) {
							if (response.status == 'connected') {
								$scope.logged = true;
								Facebook.api('/me', function(response) {
									console.log('response',response);
								    $scope.$apply(function() {
								      $scope.user = response;
								      auth.fbLoginUp(response);
								    });
								    
								  });
							}

						});
					//}
				};

				/**
				* Login
				*/
				$scope.login = function() {
					Facebook.login(function(response) {
						if (response.status == 'connected') {
							$scope.logged = true;
							$scope.me();
						}

					});
				};

				/**
				* me 
				*/
				$scope.me = function() {
				  Facebook.api('/me', function(response) {
				    /**
				     * Using $scope.$apply since this happens outside angular framework.
				     */
				    $scope.$apply(function() {
				      $scope.user = response;
				      auth.fbLogin(response);
				    });
				    
				  });
				};

				/**
				* Logout
				*/
				$scope.logout = function() {
					if(userIsConnected){
						Facebook.logout(function() {
						  $scope.$apply(function() {
						    $scope.user   = {};
						    $scope.logged = false;  
						  });
						});
					}
					auth.logOut();
				}

				/**
				* Taking approach of Events :D
				*/
				$scope.$on('Facebook:statusChange', function(ev, data) {
					if (data.status == 'connected') {

						$scope.$apply(function() {
							$scope.salutation = true;
							$scope.byebye     = false;    
						});
					} else {
					  $scope.$apply(function() {
					    $scope.salutation = false;
					    $scope.byebye     = true;
					    
					    // Dismiss byebye message after two seconds
					    $timeout(function() {
					      $scope.byebye = false;
					    }, 2000)
					  });
					}
				});
 


            }
        };
    }]);
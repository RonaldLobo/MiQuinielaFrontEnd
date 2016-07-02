angular.module('miQuinielaApp').directive('ngMenu', ['$location','auth','Facebook','$timeout',function () { 'use strict';

        return {
            restrict: 'A',
            templateUrl: 'views/menu.html',
            controller: function ($scope,$location,auth,Facebook,$timeout) {

            	var self = this;
            	$scope.user = {};

            	if(auth.isAuthenticated == false){
            		var needsToLog = auth.checkForLogin();
            		if(needsToLog){
            			$scope.displayLoginModal = true;
            			angular.element(".collapse").addClass('displayModalLogin');
            		}
            	}


            	$scope.$watch(function(){return auth.isAuthenticated;}, function (v) {
					$scope.isAuthenticated = v;
					if(v == true && $scope.displayLoginModal == true){
						$scope.displayLoginModal = false;
						angular.element(".collapse").removeClass('displayModalLogin');
					}
					if(v == true){
						$scope.user = auth.loggedUser;
					}
					if(auth.isFacebookAuth){
						$scope.isFacebookAuth = auth.isFacebookAuth;
					}
	            },true);

	            $scope.$watch(function(){return auth.isFacebookAuth;}, function (v) {
					$scope.isFacebookAuth = auth.isFacebookAuth;
	            },true);

	            $scope.regularLogin = function(user){
			    	auth.regularLogin(user);
			    }

			    $scope.showLogin = function(){
			    	$scope.displayLoginModal = true;
			    }

			    $scope.logoutBoth = function(){
			    	if($scope.isFacebookAuth){
			    		this.logout();
			    	}
			    	else{
			    		auth.logOut();
			    	}
			    }

                $scope.visible = true;
                $scope.activeLink = true;
                $scope.$on('$routeChangeSuccess', function(locationPath) {
                	$scope.home = false;
                	$scope.about = false;
                	$scope.foro = false;
                	$scope.news = false;
	                switch($location.path()){
	                	case "/": 
	                		$scope.home = true;
	                		break;
	                	case "/about": 
	                		$scope.about = true;
	                		break;
	                	case "/foro": 
	                		$scope.foro = true;
	                		break;
	                	case "/news": 
	                		$scope.news = true;
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
				Facebook.logout(function() {
				  $scope.$apply(function() {
				    $scope.user   = {};
				    $scope.logged = false;  
				  });
				  auth.logOut();
				});
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
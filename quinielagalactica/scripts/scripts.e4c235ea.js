'use strict';

/**
 * @ngdoc overview
 * @name miQuinielaApp
 * @description
 * # miQuinielaApp
 *
 * Main module of the application.
 */
angular
  .module('miQuinielaApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-jwt',
    'facebook',
    'ngLodash',
    'localytics.directives',
    'ui.bootstrap', 
    'ui.bootstrap.datetimepicker',
    'toastr'
  ])
  .constant('config', {
    appName: 'QuinielaGalactica',
    appVersion: '1.0.0',
    apiUrl: 'localhost',
    prod: 'http://tucanoquiniela.com'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'indexCtrl',
        controllerAs: 'index'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/misjuegos', {
        templateUrl: 'views/misjuegos.html',
        controller: 'MisjuegosCtrl',
        controllerAs: 'misjuegos'
      })
      .when('/configuracion', {
        templateUrl: 'views/configuracion.html',
        controller: 'ConfiguracionCtrl',
        controllerAs: 'configuracion'
      })
      .when('/torneos', {
        templateUrl: 'views/torneos.html',
        controller: 'TorneosCtrl',
        controllerAs: 'torneos'
      })
      .when('/tablas', {
        templateUrl: 'views/grupos.html',
        controller: 'GruposCtrl',
        controllerAs: 'grupos'
      })
      .when('/home', {
        templateUrl: 'views/misjuegos.html',
        controller: 'MisjuegosCtrl',
        controllerAs: 'misjuegos'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(FacebookProvider) {
     FacebookProvider.init('1809018326033062');
  })
  .config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
    jwtInterceptorProvider.tokenGetter = function(jwtHelper) {
      var jwt = localStorage.getItem('JWT');
      if(jwt){
        if (jwtHelper.isTokenExpired(jwt)) {
          // This is a promise of a JWT id_token
          // logout
        } else {  
          return jwt;
        }
      }
      return '';
    };
    $httpProvider.interceptors.push('jwtInterceptor');

    $httpProvider.interceptors.push(['$q','$injector','$location',function($q, $injector,$location) {
      return {
        responseError: function(response) {
          if (response.status === 401  ) {
            $location.path('/');
            return $q.reject(response);
          }
          return $q.reject(response);
        }
      };
    }]);
  })
  .config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      autoDismiss: false,
      containerId: 'toast-container',
      maxOpened: 2,    
      newestOnTop: true,
      positionClass: 'toast-top-center',
      preventDuplicates: false,
      preventOpenDuplicates: false,
      target: 'body',
      timeOut: 1000,
    });
  })
  .filter('reverse', function() {
    return function(items) {
      if(items){
        return items.slice().reverse();
      }
      else{
        return items;
      }
    };
  })
  .filter('removeSpaces', [function() {
    return function(string) {
        if (!angular.isString(string)) {
            return string;
        }
        return string.replace(/[\s]/g, '');
    };
  }])
  .run(function($rootScope, $location,auth) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      $rootScope.actual = next.templateUrl;
      if (auth.isAuthenticated == false) {
        if ( next.templateUrl === "partials/index.html") {
        } else {
          $location.path("/");
        }
      }
    });
    console.log('host',window.location.hostname);
    $rootScope.apiUrl = (window.location.hostname === "0.0.0.0")? 'http://0.0.0.0:82':"http://tucanoquiniela.com";
    $rootScope.isLoading = false;
  });

'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MainCtrl', ['$scope','$http','Facebook','$timeout','auth',function ($scope,$http,Facebook,$timeout,auth) {
  	$scope.displayLoginModal = false;
    this.aqui = false;
    $scope.$watch( function () { return auth.loggedUser; }, function (loggedUser) {
  	    $scope.username = loggedUser.name;
  	}, true);
	
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:modal
 * @description
 * # modal
 */
angular.module('miQuinielaApp')
  .directive('modal', function () {
    return {
        restrict: 'EA',
        templateUrl: 'views/modal.html',
        scope: {
            display: "=",
            elemento: "@"
        },
        transclude: true,
        link: function(scope, element, attributes){
            //display modal watch
            scope.$watch(function(){return scope.display;}, function (v) {
                if(v == true){
                    angular.element("#"+scope.elemento).modal('show');
                }
                else{
                    angular.element("#"+scope.elemento).modal('hide');
                    $("#"+scope.elemento).modal('hide');
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
            },true);

            element.bind("hide.bs.modal", function () {
                scope.display = false;
                angular.element(".collapse").removeClass('displayModalLogin');
                if (!scope.$$phase && !scope.$root.$$phase)
                    scope.$apply();
            });
        },
    };
});

'use strict';

/**
 * @ngdoc service
 * @name miQuinielaApp.auth
 * @description
 * # auth
 * Service in the miQuinielaApp.
 */
angular.module('miQuinielaApp')
  .service('auth', ['$rootScope','$http','$location',function ($rootScope,$http,$location) {
  	// public variables
  	this.loggedUser = {};
  	this.isAuthenticated = false,
  	this.isFacebookAuth = false,

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
  		if(user.id){
	      	$http({
				url: $rootScope.apiUrl+"/API/index.php/login",
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
                	$scope.configuracion = false;
	                switch($location.path()){
	                	case "/home": 
	                		$scope.home = true;
	                		break;
	                	case "/torneos": 
	                		$scope.torneos = true;
	                		break;
	                	case "/tablas": 
	                		$scope.tablas = true;
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
'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MisjuegosCtrl
 * @description
 * # MisjuegosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MisjuegosCtrl', ['$rootScope','$scope','lodash','$http','auth','$anchorScroll','$location','$timeout','toastr','config',function ($rootScope,$scope,lodash,$http,auth,$anchorScroll,$location,$timeout,toastr,config) {

    $scope.nuevoEquipo = {};
    $scope.urlTest="Invierno"
    $scope.nuevoPartido = {};
	$scope.email={};
    $scope.displayAddEquipo = false;
	$scope.muestraPag="noPag";
	$scope.isToday=true;
	$scope.showPerc=-1;
	function cmpVersions (a, b) {
	    var i, diff;
	    var regExStrip0 = /(\.0+)+$/;
	    var segmentsA = a.replace(regExStrip0, '').split('.');
	    var segmentsB = b.replace(regExStrip0, '').split('.');
	    var l = Math.min(segmentsA.length, segmentsB.length);

	    for (i = 0; i < l; i++) {
	        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
	        if (diff) {
	            return diff;
	        }
	    }
	    return segmentsA.length - segmentsB.length;
	}

	//verificar version del APP
	var tipoApp = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
	if ( tipoApp ) {
	    // PhoneGap application
	    $http({
		  url: $rootScope.apiUrl+"/API/index.php/versiones/",
		  method: 'GET',
		}).then(function successCallback(response) {
			if(cmpVersions(config.appVersion,response.data) < 0){
				$scope.actualizaModal = true;
			}
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

	} else {
		//Web version
	}
	$scope.showPercDiv=function(id){
		$scope.showPerc=id;
	}
    $scope.displayAgregarEquipo = function(){
    	if($scope.displayAddEquipo){
    		$scope.displayAddEquipo = false;
    	}
    	else{
    		$scope.displayAddEquipo = true;
    	}
    };
    $scope.onTextClick = function ($event) {
	    $event.target.select();
	};
    $scope.picker = {
        date: new Date()
    };

    $scope.openCalendar = function(e) {
        $scope.picker.open = true;
    };

    $scope.isAdmin = auth.loggedUser.rol == 'admin';

    $scope.displayAddPartidoModal = false;

    $scope.todayDate = new Date();
    $scope.initDate = new Date();
    $scope.finalDate = new Date()
    $scope.finalDate.setDate($scope.todayDate.getDate() + 8);
    $scope.initDate.setDate($scope.todayDate.getDate() - 7);

    function convertDate(date){
    	var dd = date.getDate();
	    var mm = date.getMonth()+1; //January is 0!

	    var yyyy = date.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
	    return yyyy+'/'+mm+'/'+dd;
    }

    function convertDateHora(date){
    	var dd = date.getDate();
	    var mm = date.getMonth()+1; //January is 0!
	    var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();

	    var yyyy = date.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
	    return yyyy+'-'+mm+'-'+dd+' '+hours+':'+minutes+':'+seconds;
    }
// var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

//     var offset = date.getTimezoneOffset() / 60;
//     var hours = date.getHours();

//     newDate.setHours(hours - offset);
var dd = $scope.todayDate.getDate();
	    var mm = $scope.todayDate.getMonth()+1; //January is 0!
	    var hours = $scope.todayDate.getHours();
		var minutes = $scope.todayDate.getMinutes();
		var seconds = $scope.todayDate.getSeconds();

	    var yyyy = $scope.todayDate.getFullYear();
	    if(dd<10){
	        dd='0'+dd
	    } 
	    if(mm<10){
	        mm='0'+mm
	    } 
//alert(hours+':'+minutes+':'+seconds);

    console.log($scope.initDate,$scope.finalDate);
    $rootScope.isLoading = true;
    $http({
	  url: $rootScope.apiUrl+"/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&fechaLocal='+hours+':'+minutes+':'+seconds,
	  method: 'GET',
	}).then(function successCallback(response) {
		$rootScope.isLoading = false;
	    $scope.partidos = response.data.partido;
		$scope.filtradosPasado = lodash.filter($scope.partidos, function(o) { 
	    	var date = new Date();
	    	var dateTime = o.fecha.split(" ");
		    var dateOnly = dateTime[0];
		    var timeOnly = dateTime[1];

		    var temp = dateOnly + "T" + timeOnly;
		    function dateFromString(str) {
			  var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
			  return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
			}
	    	return date >= new Date(dateFromString(temp).setHours(dateFromString(temp).getHours()+2)); 
	    });
		$scope.filtradosAhora = lodash.filter($scope.partidos, function(o) { 
	    	var date = new Date();
	    	var dateTime = o.fecha.split(" ");
		    var dateOnly = dateTime[0];
		    var timeOnly = dateTime[1];

		    var temp = dateOnly + "T" + timeOnly;
		    function dateFromString(str) {
			  var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
			  return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
			}
	    	//console.log(date+" -- "+new Date(dateFromString(temp)));
	    	return date >= new Date(dateFromString(temp)) && date< new Date(dateFromString(temp)).setHours(dateFromString(temp).getHours()+2); 
	    });
	    $scope.filtradosFuturo = lodash.filter($scope.partidos, function(o) { 
	    	var date = new Date();
	    	var dateTime = o.fecha.split(" ");
		    var dateOnly = dateTime[0];
		    var timeOnly = dateTime[1];

		    var temp = dateOnly + "T" + timeOnly;
		    function dateFromString(str) {
			  var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
			  return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
			}
	    	return date < new Date(dateFromString(temp));  
	    });
	    // set the location.hash to the id of
	    // the element you wish to scroll to.
	    $timeout(function(){

    		var old = $location.hash();
    		if($scope.filtradosAhora.length)$location.hash('ahora');
	    	else $location.hash('hoy');

		    // call $anchorScroll()
		    $anchorScroll();
			$location.hash(old);
			$scope.muestraPag="siPag";

		    angular.element('.scroll-icon').addClass('blink_me');
		    $timeout(function(){
			    angular.element('.scroll-icon').addClass('hide');
		    }, 3000);
	    }, 700);
	    
	}, function errorCallback(response) {
		$rootScope.isLoading = false;
	    if(response.status == 401){
	    	auth.logOut();
	    }
	});

	// traer equipos y torneos
	if(auth.loggedUser.rol == 'admin'){
		$http({
		  url: $rootScope.apiUrl+"/API/index.php/equipo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.equipos = response.data.equipo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: $rootScope.apiUrl+"/API/index.php/torneo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.torneos = response.data.torneo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
	}
	$scope.irHoy=function(){
		var old = $location.hash();
    		if($scope.filtradosAhora.length)$location.hash('ahora');
	    	else $location.hash('hoy');

		    // call $anchorScroll()
		    $anchorScroll();
			$location.hash(old);
	}
	$scope.lastMatchDate="";
	$scope.sameDate=function(date){
		if(date!=$scope.lastMatchDate){
			$scope.lastMatchDate=date;
			return true;
		}
		return false;
	}
	$scope.guardarPartido = function(partido){
		if(!isNaN(partido.marcadorEquipo1) && !isNaN(partido.marcadorEquipo2)){
	    	var partido = {
	    		partido : {
	    			idPartido: Number(partido.idPartido),
	    			marcadorEquipo1: Number(partido.marcadorEquipo1),
	    			marcadorEquipo2: Number(partido.marcadorEquipo2)
	    		}
	    	};
	    	$http({
			  url: $rootScope.apiUrl+"/API/index.php/partidos/?method=PUT",
			  data: partido,
			  method: 'POST',
			}).then(function successCallback(response) {
				toastr.success('', 'Partido Actualizado');
				$http({
				  url: $rootScope.apiUrl+"/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&XDEBUG_SESSION_START=netbeans-xdebug',
				  method: 'GET',
				}).then(function successCallback(response) {
				    //console.log('success',response.data.partido);
				    $scope.partidos = response.data.partido;
					$scope.filtradosPasado = lodash.filter($scope.partidos, function(o) { 
				    	var date = new Date();
				    	//console.log(date);
				    	//console.log(Date(o.fecha));
				    	return date >= new Date(o.fecha); 
				    });

				    $scope.filtradosFuturo = lodash.filter($scope.partidos, function(o) { 
				    	var date = new Date();
				    	return date < new Date(o.fecha);  
				    });
				    $scope.displayAddPartidoModal = false;
				}, function errorCallback(response) {
				    if(response.status == 401){
				    	auth.logOut();
				    }
				});
			}, function errorCallback(response) {
			    if(response.status == 401){
			    	auth.logOut();
			    }
			});
		}
		else
		{
			console.log('no digito numeros');
		}
	};
	 
    $scope.guardarPrediccion = function(partido,num){
    	if(!isNaN(partido.prediccion.marcador1) && !isNaN(partido.prediccion.marcador2)){
	    	var prediccion = {
	    		prediccion : {
	    			id: Number(partido.prediccion.id),
	    			idPartido: Number(partido.idPartido),
	    			idUsuario: Number(auth.loggedUser.id),
	    			marcador1: Number(partido.prediccion.marcador1),
	    			marcador2: Number(partido.prediccion.marcador2),
	    			puntaje: 0
	    		}
	    	};
	    	$http({
			  url: $rootScope.apiUrl+"/API/index.php/predicciones/?method=PUT",
			  data: prediccion,
			  method: 'POST',
			}).then(function successCallback(response) {
				angular.element( document.getElementsByClassName( 'row-'+num ) ).addClass("bordeVerde");
				//alert('prediccion guardada');
				toastr.success('', 'Prediccion Guardada');
			}, function errorCallback(response) {
			    if(response.status == 401){
			    	auth.logOut();
			    }
			});
		}
		else
		{
			console.log('no digito numeros');
		}
    };

    $scope.agregarPartido = function(){
    	$scope.displayAddPartidoModal = true;
    };
    $scope.agregarEmail = function(){
    	$scope.displayAddEmailModal = true;
    };

    $scope.agregarPartidoNuevo = function(){
    	var partido = {
    		partido: {
	    		idPartidoTorneo : Number($scope.nuevoPartido.torneo),
	    		idPartidoEquipo1: Number($scope.nuevoPartido.equipo1),
	    		idPartidoEquipo2: Number($scope.nuevoPartido.equipo2),
	    		marcadorEquipo1: 0,
	    		marcadorEquipo2: 0,
	    		jornada: $scope.nuevoPartido.jornada,
	    		fecha: convertDateHora($scope.picker.date)
	    	}
    	};
    	$http({
		  url: $rootScope.apiUrl+"/API/index.php/partidos/",
		  data: partido,
		  method: 'POST',
		}).then(function successCallback(response) {
		    $http({
			  url: $rootScope.apiUrl+"/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&XDEBUG_SESSION_START=netbeans-xdebug',
			  method: 'GET',
			}).then(function successCallback(response) {
			    //console.log('success',response.data.partido);
			    $scope.partidos = response.data.partido;
				$scope.filtradosPasado = lodash.filter($scope.partidos, function(o) { 
			    	var date = new Date();
			    	console.log(date);
			    	console.log(Date(o.fecha));
			    	return date >= new Date(o.fecha); 
			    });

			    $scope.filtradosFuturo = lodash.filter($scope.partidos, function(o) { 
			    	var date = new Date();
			    	return date < new Date(o.fecha);  
			    });
			    $scope.displayAddPartidoModal = false;
			}, function errorCallback(response) {
			    if(response.status == 401){
			    	auth.logOut();
			    }
			});
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: $rootScope.apiUrl+"/API/index.php/torneo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.torneos = response.data.torneo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
    };

    $scope.agregarEmailNuevo = function(){
    	var txt;
		var r = confirm("Desea realmente enviar el correo?");
		if (r == true) {
	    	var email = {
	    		email: {
		    		"subject" : $scope.email.titulo,
		    		"body": $scope.email.contenido,
		    		"user":$scope.email.correo
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

		} 
    };

    $scope.agregarEquipo = function(){
    	var equipo = {
    		equipo : {
    			equipo: $scope.nuevoEquipo.nombre,
    			acronimo: $scope.nuevoEquipo.acronimo,
    			estado: 1
    		}
    	};
    	$http({
		  url: $rootScope.apiUrl+"/API/index.php/equipo/",
		  data: equipo,
		  method: 'POST',
		}).then(function successCallback(response) {
		    $scope.equipos.push(response.data.equipo);
		    $scope.displayAddEquipo = false;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
    };

  }]);

'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:parseFecha
 * @description
 * # parseFecha
 */
angular.module('miQuinielaApp')
  .directive('parseFecha', function () {
    return {
      template: '<div></div>',
      restrict: 'EA',
      scope: {
            fecha: "="
      },
      link: function postLink(scope, element, attrs) {
        var dateTime = scope.fecha.split(" ");
        var dateOnly = dateTime[0];
        var timeOnly = dateTime[1];

        var temp = dateOnly + "T" + timeOnly;
        function dateFromString(str) {
          var a = $.map(str.split(/[^0-9]/), function(s) { return parseInt(s, 10) });
          return new Date(a[0], a[1]-1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
        }

      	var date = new Date(dateFromString(temp));
        var month = date.getMonth() + 1;
        element.text(date.getDate()+'/'+month+'/'+date.getFullYear()+' '+date.getHours() + ':'+date.getMinutes());
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('ConfiguracionCtrl', function ($rootScope,$scope,auth,$http) {
    $scope.usuario = auth.loggedUser; // Usuario logeado

  	$scope.actualizarUsuario = function(){
  		var usuario = {
  			"usuario": $scope.usuario
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
		}, function errorCallback(response) {
        $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	};

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

'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:TorneosCtrl
 * @description
 * # TorneosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('TorneosCtrl', ['$rootScope','$http','$scope','$timeout','auth','lodash',function ($rootScope,$http,$scope,$timeout,auth,lodash) {

if(auth.loggedUser.rol == 'admin'){
    ListarTorneosPorUsuarioAdmin();
   }
   else{
     ListarTorneosPorUsuario();

     ListarTorneosGlobal();
  }

    function ListarTorneosPorUsuario(){
      $http({
          url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+auth.loggedUser.id,
          method: 'GET',
       }).then(function successCallback(response) {
           console.log('success',response);
           $scope.torneosUsuario = response.data.torneo;
       }, function errorCallback(response) {
           alert( "Request failed: " + response );
       });
    } 

    function ListarTorneosPorUsuarioAdmin(){
      $http({
        url: $rootScope.apiUrl+"/API/index.php/torneo/",
        method: 'GET',
     }).then(function successCallback(response) {
         console.log('success',response);
         $scope.torneosUsuario = response.data.torneo;
     }, function errorCallback(response) {
         alert( "Request failed: " + response );
     });
     }

    function ListarTorneosGlobal(){
      $http({
        url: $rootScope.apiUrl+"/API/index.php/torneo/",
        method: 'GET',
     }).then(function successCallback(response) {
         console.log('success',response);
         $scope.torneosUsuarioGlobal = response.data.torneo;
     }, function errorCallback(response) {
         alert( "Request failed: " + response );
     });
    }

      $scope.addTorneo = function(){
        if(auth.loggedUser.rol == 'admin'){
           $scope.showAgregarTorneo = true;
        }else{
           $scope.showAgregarTorneoUsuario = true;
        }
      }
      
      $scope.addTorneoAdmin = function(torneo) {
        var torneoAdmin = {
          "torneo": {
            "torneo": torneo,
            "estado": 1
            }
        }
        if(torneo != undefined){
         $http({
           url: $rootScope.apiUrl+"/API/index.php/torneo/",
           method: 'POST',
           data: JSON.stringify(torneoAdmin)
         }).then(function successCallback(response) {
             $scope.showAgregarTorneo = false;
              $scope.torneosUsuario.push(response.data.torneoAdmin);
              ListarTorneosPorUsuarioAdmin();
             $http({
                 url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/",
                 method: 'POST',
                 data: {
                  "usuarioTorneo": {
                    "torneo": response.data.torneo.id,
                    "usuario": auth.loggedUser.id
                    }
                   }
               }).then(function successCallback(response) {
                $timeout(function() {
                });
               }, function errorCallback(response) {
                   alert( "Request failed: " + response );
               });
         }, function errorCallback(response) {
             alert( "Request failed: " + response );
         });
        }
        else{ 
          $scope.showAgregarTorneo = false;
         }
       };

       $scope.addTorneoUsuario = function(torneo) {
        var torneoUsuario = {
          "usuarioTorneo": {
            "torneo": torneo.id,
            "usuario": auth.loggedUser.id
            }
           }
           
         var validaTorneoLista = _.filter($scope.torneosUsuario,{ 'id': torneo.id }); 
         if(Object.keys(validaTorneoLista).length == 0){ 
            $http({
                 url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/",
                 method: 'POST',
                 data: {
                  "usuarioTorneo": {
                    "torneo": torneo.id,
                    "usuario": auth.loggedUser.id
                    }
                   }
               }).then(function successCallback(response) {
                   $scope.showAgregarTorneoUsuario = false;
                $timeout(function() {
                    $scope.torneosUsuario.push(response.data.torneoUsuario);
                    ListarTorneosPorUsuario();
                });
               }, function errorCallback(response) {
                   alert( "Request failed: " + response );
               });
         }else{
            $scope.showAgregarTorneoUsuario = false;
         }
       }

      $scope.delTorneo = function(idTorneo) {
       if(auth.loggedUser.rol == 'admin'){
         $http({
          url: $rootScope.apiUrl+"/API/index.php/torneo/"+idTorneo,
          method: 'DELETE',
       }).then(function successCallback(response) {
           console.log('success',response);
          $timeout(function() {
            $scope.torneosUsuario = _.remove($scope.torneosUsuario, function(n) {
              return n.id != idTorneo;
              });
           });
       }, function errorCallback(response) {
           alert( "Request failed: " + response );
       });
        } else {
          $http({
          url: $rootScope.apiUrl+"/API/index.php/usuarioTorneos/"+idTorneo,
          method: 'DELETE',
       }).then(function successCallback(response) {
           console.log('success',response);
          $timeout(function() {
            $scope.torneosUsuario = _.remove($scope.torneosUsuario, function(n) {
              return n.id != idTorneo;
              });
           });
       }, function errorCallback(response) {
           //alert( "Request failed: " + response );
           alert( "Error al eliminar torneo");
       });
        }
      }
      
  }]);
  
'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:GruposCtrl
 * @description
 * # GruposCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
.run(['$anchorScroll', function($anchorScroll) {
  $anchorScroll.yOffset = 250;   // always scroll by 50 extra pixels
}])

  .controller('GruposCtrl',  function ($rootScope,$scope,auth,$http, $location, $anchorScroll) {
    //get user logged
    $scope.usuarioLog=auth.loggedUser.id
    $scope.ordenUsuarios='position';
    $scope.flecha="Desc";
	$scope.usuarios=[];
	$scope.usuariosTodos={};
	$scope.grupos={};
	$scope.partidos={};
	$scope.jornadas={};
    $scope.displayAddGrupoModal = false;
    $scope.displayPredGrupoModal = false;
    $scope.grupoNuevo={};
    $scope.grupoNuevo.listaUsuarios=[];
    $scope.act={};
    $scope.grupoNuevo.otrosGrupos=[];
    $scope.predicciones={};
    $scope.act.crear="active";
    $scope.muestraTab=true;


    $scope.cambiarOrden=function  (argument) {
    	$scope.flecha==="Desc" ? $scope.flecha="Asc": $scope.flecha="Desc";
    	$scope.ordenUsuarios==='-position' ? $scope.ordenUsuarios='position': $scope.ordenUsuarios='-position';

    }
  	var actualizaGrupos = function(){
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/grupos/?userId="+$scope.usuarioLog,
		  method: "GET",
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
			$scope.grupos = response.data.grupos;
	  		if($scope.grupos.length > 0){
		  		$scope.grupoSeleccionado=$scope.grupos[0];
		  		$scope.actualizarLista($scope.grupoSeleccionado.id,0);
		  	}

		}, function errorCallback(response) {
            $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

  	};
  	$scope.actualizaJornadas = function(idTorneo){
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/partidos/?torneo="+idTorneo,
		  method: "GET",
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
			$scope.partidos = response.data.partido;
		}, function errorCallback(response) {
            $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

  	};
    var cambiaMensaje=function(msg){

			$scope.error=msg;

    };
    $scope.active=function(tab){
    	if(tab==2){
    		$scope.act.crear="";
    		$scope.act.buscar="active";
    		$scope.muestraTab=false;
    	}else{
    		$scope.act.crear="active";
    		$scope.act.buscar="";  
    		$scope.muestraTab=true;  		
    	}
    	cambiaMensaje("");
    }
  	$scope.actualizarLista = function(grupoId, jornada){

  		if(jornada==0)$scope.actualizaJornadas($scope.grupoSeleccionado.idTorneo);
  		if(jornada==undefined)jornada=0;
        $rootScope.isLoading = true;
  		$http({
		  url: $rootScope.apiUrl+"/API/index.php/usuarios/?userPoints="+grupoId+"&jornada="+jornada,
		  method: "GET"
		}).then(function successCallback(response) {
            $rootScope.isLoading = false;
	  		$scope.usuarios=response.data.usuarios;
		}, function errorCallback(response) {
            $rootScope.isLoading = false;
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: $rootScope.apiUrl+"/API/index.php/usuarios/?byUser="+$scope.usuarioLog,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.usuariosTodos=response.data.usuarios;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
		$scope.grupoNuevo.otrosGrupos=[]; 
		$http({
		  url: $rootScope.apiUrl+"/API/index.php/torneo/?usuario="+$scope.usuarioLog,
		  method: "GET"
		}).then(function successCallback(response) {
	  		$scope.torneos=response.data.torneo;
			for (var i = 0; i < $scope.torneos.length; i++) {
				$http({
				  url: $rootScope.apiUrl+"/API/index.php/grupos/?sinUserId="+$scope.usuarioLog+"&torneo="+$scope.torneos[i].id,
				  method: "GET"
				}).then(function successCallback(response) {
			  		$scope.grupoNuevo.otrosGrupos.splice.apply($scope.grupoNuevo.otrosGrupos, [response.data.grupos.length, 0].concat(response.data.grupos));
				}, function errorCallback(response) {
				    if(response.status == 401){
				    	auth.logOut();
				    }
				});
			};
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	};
  	$scope.agregarGrupo = function(){
    	$scope.displayAddGrupoModal = true;
    };
    $scope.agregarUsuario=function(){
    	if(typeof($scope.grupoNuevo.user)!=="undefined" && $scope.grupoNuevo.user.usuario!=="" && $scope.grupoNuevo.user!==0){
	  		//$scope.$apply(function() {
	  			if($scope.usuarioLog!==$scope.grupoNuevo.user.id && !usuarioRepetido($scope.grupoNuevo.user.usuario)){
		  			$scope.grupoNuevo.listaUsuarios[$scope.grupoNuevo.listaUsuarios.length]={
		  				usuario:$scope.grupoNuevo.user.usuario,
		  				id:$scope.grupoNuevo.user.id,
		  				correo:$scope.grupoNuevo.user.correo,
		  				nombre:$scope.grupoNuevo.user.nombre+" "+$scope.grupoNuevo.user.apellido1
		  			};
					cambiaMensaje("");
		  		}else {cambiaMensaje("Usuario invalido");}
			$scope.grupoNuevo.user=0;
	  		//});			  		

		}else{
			cambiaMensaje("Usuario vacío");
		}
    };
    var usuarioRepetido=function(user){
    	for (var i = $scope.grupoNuevo.listaUsuarios.length - 1; i >= 0; i--) {
    		if($scope.grupoNuevo.listaUsuarios[i].usuario===user){
    			return true;
    		}
    	};
    	return false;
    };
    $scope.removerUsuario=function(elemento){

    		$scope.grupoNuevo.listaUsuarios.splice(elemento,1);
    };
    $scope.crearGrupo=function(){    	
    	if(typeof($scope.grupoNuevo.torneoSelect)!=="undefined" && $scope.grupoNuevo.name!=="" && $scope.grupoNuevo.torneoSelect.id!=="" && $scope.grupoNuevo.torneoSelect!==0){
	      	$http({
			  	url: $rootScope.apiUrl+"/API/index.php/grupos/",
				skipAuthorization: true,
			  	method: "POST",
			  	data: {
			  		"grupo":{
			      		"idTorneo":$scope.grupoNuevo.torneoSelect.id,
			      		"idUsuario":$scope.usuarioLog,
			      		"estado":1,
			      		"nombre":$scope.grupoNuevo.name
			  		}	

			   	}
			}).then(function(response) {
				var migrupo=response.data.grupo.id;
					$http({
					  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
						skipAuthorization: true,
					  	method: "POST",
					  	data: {
					  		"usuarioGrupo":{
					      		"usuario":$scope.usuarioLog,
					      		"grupo":response.data.grupo.id,
					      		"estado":"miembro"
					  		}	

					   	}
					}).then(function(response) {
						if($scope.grupoNuevo.listaUsuarios.length>0){
							for (var i = 0; i < $scope.grupoNuevo.listaUsuarios.length; i++) {
								$http({
								  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
									skipAuthorization: true,
								  	method: "POST",
								  	data: {
								  		"usuarioGrupo":{
								      		"usuario":$scope.grupoNuevo.listaUsuarios[i].id,
								      		"grupo":migrupo,
								      		"estado":"miembro"
								  		}	

								   	}
								}).then(function(response) {
								   		//$scope.grupoNuevo.id=response.data.grupo.id;
										$scope.grupoNuevo.listaUsuarios={};
										actualizaGrupos();
										alert("Grupo agregado");
								   	},function(error){
										console.log('error',error.data.error.error);
										self.errorLogUp = error.data.error.error;
								});
								
							};
						}else{
							$scope.grupoNuevo.listaUsuarios={};
							actualizaGrupos();
							alert("Grupo agregado");

						}

					   	},function(error){
							console.log('error',error.data.error.error);
							self.errorLogUp = error.data.error.error;
					});
			   	},function(error){
					console.log('error',error.data.error.error);
					self.errorLogUp = error.data.error.error;
			});
			$scope.grupoNuevo.user=0;
			$scope.grupoNuevo.torneoSelect=0;
			cambiaMensaje("");
			$scope.grupoNuevo.name="";
		}else cambiaMensaje("Llenar todos los datos");
    	
    };
    $scope.unirGrupo=function(){
    	console.log($scope.grupoNuevo.grupoSelect);
    	if($scope.grupoNuevo.grupoSelect!==0 && typeof($scope.grupoNuevo.grupoSelect)!=="undefined"){
	    	$http({
			  	url: $rootScope.apiUrl+"/API/index.php/invitaciones/",
				skipAuthorization: true,
			  	method: "POST",
			  	data: {
			  		"usuarioGrupo":{
			      		"usuario":$scope.usuarioLog,
			      		"grupo":$scope.grupoNuevo.grupoSelect.id,
			      		"estado":"miembro"
			  		}	

			   	}
			}).then(function(response) {
			   		//$scope.grupoNuevo.id=response.data.grupo.id;
					$scope.grupoNuevo.grupoSelect=0;
					actualizaGrupos();
					alert("Ahora estás en este grupo");
					cambiaMensaje("");
			   	},function(error){
					console.log('error',error.data.error.error);
					self.errorLogUp = error.data.error.error;
			});
		}else cambiaMensaje("No ha seleccionado ningún Grupo");
	  }
	  $scope.gotoBottom = function() {
	      // set the location.hash to the id of
	      // the element you wish to scroll to.
	      
    		  var old = $location.hash();
		      $location.hash('pos-'+$scope.usuarioLog);

		      // call $anchorScroll()
		      $anchorScroll();
   			  $location.hash(old);
	    };
	    $scope.muestraPredicciones=function(userId){

    		$scope.displayPredGrupoModal = true;
            $rootScope.isLoading = true;
	    	//alert($scope.grupoSeleccionado.idTorneo);
	    	$http({
				  url: $rootScope.apiUrl+"/API/index.php/usuarios/"+userId,
				  method: 'GET',
				}).then(function successCallback(response) {
                    $rootScope.isLoading = false;
				    $scope.predicciones.user=response.data.usuario;
				}, function errorCallback(response) {
                    $rootScope.isLoading = false;
				});
	    	$http({
				  url: $rootScope.apiUrl+"/API/index.php/predicciones/?userId="+userId+'&torneoId='+$scope.grupoSeleccionado.idTorneo,
				  method: 'GET',
				}).then(function successCallback(response) {
				    $scope.predicciones.userPredictions=response.data.predicciones;
				}, function errorCallback(response) {
				});
	    }

	  actualizaGrupos();
    
  });

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

'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:background
 * @description
 * # background
 */
angular.module('miQuinielaApp')
  .directive('background', function () {
    return {
      templateUrl: 'views/background.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	scope.displayBg = true;
        scope.$on('$routeChangeStart', function(scopeTwo, next, current) { 
		   if(next.templateUrl == "views/index.html"){
		   		scope.displayBg = true;
		   }
		   else{
		   		scope.displayBg = false;
		   }
		});
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name miQuinielaApp.directive:stringToNumber
 * @description
 * # background
 */
angular.module('miQuinielaApp')
.directive('stringToNumber', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  };
});
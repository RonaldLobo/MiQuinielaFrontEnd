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
    appName: 'AppQuiniela',
    appVersion: '1.0.1',
    apiUrl: 'localhost'
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
      .when('/grupos', {
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
      return items.slice().reverse();
    };
  })
  .run(function($rootScope, $location,auth) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      $rootScope.actual = next.templateUrl;
      // if ( next.templateUrl === "partials/index.html") {
      //   $rootScope.actual = '/';
      // }
      if (auth.isAuthenticated == false) {
        if ( next.templateUrl === "partials/index.html") {
        } else {
          $location.path("/");
        }
      }
    });
  });

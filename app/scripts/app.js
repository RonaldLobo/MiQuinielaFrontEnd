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
    'facebook'
  ])  
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
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
      return 'asdasdasdasdasdasdasda';
    };
    $httpProvider.interceptors.push('jwtInterceptor');
  });

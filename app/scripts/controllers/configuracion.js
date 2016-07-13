'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('ConfiguracionCtrl', function ($scope,auth) {
    //get user logged
    $scope.$watch( function () { return auth.loggedUser; }, function (loggedUser) {
    	console.log('logueado',loggedUser)
    	$scope.usuario = loggedUser;
  	    //obtenerUsuario(loggedUser.id);
  	}, true);

  // 	function obtenerUsuario(id){
  // 		console.log('called');
  // 		var request = $.ajax({
		//   url: "http://localhost/API/index.php/usuarios/"+id,
		//   method: "GET",
		// });
		 
		// request.done(function( data ) {
		//   console.log('success',data.usuario);
		//   $scope.usuario = data.usuario;
		// });
		 
		// request.fail(function( jqXHR, textStatus ) {
		//   alert( "Request failed: " + textStatus );
		// });
  // 	}
    
  });

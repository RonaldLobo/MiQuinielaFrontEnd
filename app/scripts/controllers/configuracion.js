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
    	//get invitaciones

  	}, true);

  	$scope.actualizarUsuario = function(){
  		console.log('called 1');
  		var usuario = {
  			"usuario": $scope.usuario
  		}
  		console.log(usuario);
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/usuarios/",
		  method: "PUT",
		  data: JSON.stringify(usuario),
    	  dataType: "json",
    	  contentType: "application/json; charset=utf-8",
		});
  	};

  	obtenerInvitaciones(1);

  	function obtenerInvitaciones(id){
  		console.log('called 2');
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/invitaciones/"+id,
		  method: "GET",
		});
		 
		request.done(function( data ) {
		  console.log('success',data.grupos);
		  $scope.invitaciones = data.grupos;
		});
		 
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
  	}

  	$scope.aceptarInvitacion = function(id){
  		var request = $.ajax({
		  url: "http://localhost/API/index.php/invitaciones/"+id+"?XDEBUG_SESSION_START=netbeans-xdebug",
		  method: "PUT",
		  dataType: "text"
		});

		request.done(function() {
			console.log('in here');
			$scope.$apply(function() {
				$scope.invitaciones = _.remove($scope.invitaciones, function(n) {
					console.log('inside',id);
				  console.log(n,n.id, n.id == id);
				  return n.id != id;
			  	});
			});
		    
		});
		 
		request.fail(function( jqXHR, textStatus ) {
		  alert( "Request failed: " + textStatus );
		});
  	}
    
  });

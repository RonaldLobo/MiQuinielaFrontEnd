'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:ConfiguracionCtrl
 * @description
 * # ConfiguracionCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('ConfiguracionCtrl', function ($scope,auth,$http) {
    //get user logged
    $scope.usuario = auth.loggedUser;
    console.log($scope.usuario);

  	$scope.actualizarUsuario = function(){
  		var usuario = {
  			"usuario": $scope.usuario
  		}
  		console.log(usuario);
  		$http({
		  url: "/API/index.php/usuarios/?method=PUT",
		  method: "POST",
		  data: usuario
		}).then(function successCallback(response) {
		    $scope.usuario = response.data.usuario;
		    localStorage.setItem('usuario', JSON.stringify($scope.usuario));	
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	};

  	obtenerInvitaciones(auth.loggedUser.id);

  	function obtenerInvitaciones(id){
  		$http({
		  url: "/API/index.php/invitaciones/"+id,
		  method: "GET",
		}).then(function successCallback(response) {
		    $scope.invitaciones = response.data.grupos;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
		
  	}

  	$scope.aceptarInvitacion = function(id){
  		$http({
		  url: "/API/index.php/invitaciones/?id="+id+"&method=PUT",
		  method: "POST",
		  dataType: "text"
		}).then(function successCallback(response) {
		    $scope.$apply(function() {
				$scope.invitaciones = _.remove($scope.invitaciones, function(n) {
				  console.log(n,n.id, n.id == id);
				  return n.id != id;
			  	});
			});
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
  	}

  	$scope.cancelarUsuario = function(){
  		$scope.usuario = JSON.parse(localStorage.getItem('usuario'));
  	}
    
  });

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

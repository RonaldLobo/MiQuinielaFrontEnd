'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MisjuegosCtrl
 * @description
 * # MisjuegosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MisjuegosCtrl', ['$scope','lodash','$http',function ($scope,lodash,$http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.displayAddPartidoModal = false;

    $scope.todayDate = new Date();
    $scope.initDate = new Date();
    $scope.finalDate = new Date()
    $scope.finalDate.setDate($scope.todayDate.getDate() + 7);
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

    console.log($scope.initDate,$scope.finalDate);
    $http({
	  url: "http://localhost/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&XDEBUG_SESSION_START=netbeans-xdebug',
	  method: 'GET',
	}).then(function successCallback(response) {
	    console.log('success',response.data.partido);
	    $scope.partidos = response.data.partido;
		$scope.filtradosPasado = lodash.filter($scope.partidos, function(o) { 
	    	var date = new Date();
	    	return date.getTime() >= o.fecha; 
	    });

	    $scope.filtradosFuturo = lodash.filter($scope.partidos, function(o) { 
	    	var date = new Date();
	    	return date.getTime() < o.fecha;  
	    });
	}, function errorCallback(response) {
	    alert( "Request failed: " + response );
	});
	 
    $scope.guardarPrediccion = function(id,idPrediccion,marcador1,marcador2){
    	console.log('guardar',id,idPrediccion,marcador1,marcador2);
    };

    $scope.agregarPartido = function(){
    	$scope.displayAddPartidoModal = true;
    };

  }]);

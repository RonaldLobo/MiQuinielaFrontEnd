'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MisjuegosCtrl
 * @description
 * # MisjuegosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MisjuegosCtrl', ['$scope','lodash','$http','auth','$anchorScroll','$location','$timeout','toastr',function ($scope,lodash,$http,auth,$anchorScroll,$location,$timeout,toastr) {

	// $('.btn-navbar').click(); //bootstrap 2.x
 //    $('.navbar-toggle').click() //bootstrap 3.x by Richard

    $scope.nuevoEquipo = {};

    $scope.nuevoPartido = {};

    $scope.displayAddEquipo = false;
	$scope.muestraPag="noPag";

    $scope.displayAgregarEquipo = function(){
    	if($scope.displayAddEquipo){
    		$scope.displayAddEquipo = false;
    	}
    	else{
    		$scope.displayAddEquipo = true;
    	}
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


    console.log($scope.initDate,$scope.finalDate);
    $http({
	  url: "http://appquiniela.com/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate),
	  method: 'GET',
	}).then(function successCallback(response) {
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
	    	return date >= new Date(dateFromString(temp)); 
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
	    	$location.hash('hoy');

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
	    if(response.status == 401){
	    	auth.logOut();
	    }
	});

	// traer equipos y torneos
	if(auth.loggedUser.rol == 'admin'){
		$http({
		  url: "http://appquiniela.com/API/index.php/equipo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.equipos = response.data.equipo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});

		$http({
		  url: "http://appquiniela.com/API/index.php/torneo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.torneos = response.data.torneo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
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
			  url: "http://appquiniela.com/API/index.php/partidos/?method=PUT",
			  data: partido,
			  method: 'POST',
			}).then(function successCallback(response) {
				toastr.success('', 'Partido Actualizado');
				$http({
				  url: "http://appquiniela.com/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&XDEBUG_SESSION_START=netbeans-xdebug',
				  method: 'GET',
				}).then(function successCallback(response) {
				    console.log('success',response.data.partido);
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
			  url: "http://appquiniela.com/API/index.php/predicciones/?method=PUT",
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

    $scope.agregarPartidoNuevo = function(){
    	var partido = {
    		partido: {
	    		idPartidoTorneo : Number($scope.nuevoPartido.torneo),
	    		idPartidoEquipo1: Number($scope.nuevoPartido.equipo1),
	    		idPartidoEquipo2: Number($scope.nuevoPartido.equipo2),
	    		marcadorEquipo1: 0,
	    		marcadorEquipo2: 0,
	    		fecha: convertDateHora($scope.picker.date)
	    	}
    	};
    	$http({
		  url: "http://appquiniela.com/API/index.php/partidos/",
		  data: partido,
		  method: 'POST',
		}).then(function successCallback(response) {
		    $http({
			  url: "http://appquiniela.com/API/index.php/partidos/?fechaInicio="+convertDate($scope.initDate)+'&fechaFin='+convertDate($scope.finalDate)+'&XDEBUG_SESSION_START=netbeans-xdebug',
			  method: 'GET',
			}).then(function successCallback(response) {
			    console.log('success',response.data.partido);
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
		  url: "http://appquiniela.com/API/index.php/torneo/",
		  method: 'GET',
		}).then(function successCallback(response) {
		    $scope.torneos = response.data.torneo;
		}, function errorCallback(response) {
		    if(response.status == 401){
		    	auth.logOut();
		    }
		});
    };

    $scope.agregarEquipo = function(){
    	var equipo = {
    		equipo : {
    			equipo: $scope.nuevoEquipo.nombre,
    			estado: 1
    		}
    	};
    	$http({
		  url: "http://appquiniela.com/API/index.php/equipo/",
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

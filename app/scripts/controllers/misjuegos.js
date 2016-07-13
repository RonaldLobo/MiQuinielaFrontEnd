'use strict';

/**
 * @ngdoc function
 * @name miQuinielaApp.controller:MisjuegosCtrl
 * @description
 * # MisjuegosCtrl
 * Controller of the miQuinielaApp
 */
angular.module('miQuinielaApp')
  .controller('MisjuegosCtrl', ['$scope','lodash',function ($scope,lodash) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.partidos = [
    	{
    		id : 1,
			equipo1 : "LDA",
			equipo2 : "La S",
			marcadorEquipo1 : 2,
		    marcadorEquipo2 : 1,
		    prediccion: {
		    	id : 1,
		    	marcadorEquipo1: 2,
		    	marcadorEquipo2: 1,
		    	puntaje: 3
		    },
		    torneo: {
		    	id: 1,
		    	nombre: 'Liga de Costa Rica'
		    },
		    fecha : 1467582344906
    	},
    	{
    		id : 2,
			equipo1 : "Perez",
			equipo2 : "Santos",
			marcadorEquipo1 : 2,
		    marcadorEquipo2 : 1,
		    prediccion: {
		    	id : 2,
		    	marcadorEquipo1: 2,
		    	marcadorEquipo2: 0,
		    	puntaje: 1
		    },
		    torneo: {
		    	id: 1,
		    	nombre: 'Liga de Costa Rica'
		    },
		    fecha : 1467582344906
    	},
    	{
    		id : 3,
			equipo1 : "Liberia",
			equipo2 : "San Carlos",
			marcadorEquipo1 : 1,
		    marcadorEquipo2 : 1,
		    prediccion: {
		    	id : 3,
		    	marcadorEquipo1: 1,
		    	marcadorEquipo2: 0,
		    	puntaje: 0
		    },
		    torneo: {
		    	id: 1,
		    	nombre: 'Liga de Costa Rica'
		    },
		    fecha : 1467582344906
    	},
    	{
    		id : 4,
			equipo1 : "Limon",
			equipo2 : "Belen",
			marcadorEquipo1 : 0,
		    marcadorEquipo2 : 0,
		    prediccion: {
		    	id : 7,
		    	marcadorEquipo1: 2,
		    	marcadorEquipo2: 0,
		    	puntaje: 0
		    },
		    torneo: {
		    	id: 1,
		    	nombre: 'Liga de Costa Rica'
		    },
		    fecha : 1467755144906
    	},
    	{
    		id : 5,
			equipo1 : "Heredia",
			equipo2 : "La U",
			marcadorEquipo1 : 0,
		    marcadorEquipo2 : 0,
		    prediccion: {
		    	id : 6,
		    	marcadorEquipo1: 0,
		    	marcadorEquipo2: 0,
		    	puntaje: 0
		    },
		    torneo: {
		    	id: 1,
		    	nombre: 'Liga de Costa Rica'
		    },
		    fecha : 1467755144906 //time basado en la epoca UNIX
    	}
    ];

    $scope.filtradosPasado = lodash.filter($scope.partidos, function(o) { 
    	var date = new Date();
    	return date.getTime() >= o.fecha; 
    });

    $scope.filtradosFuturo = lodash.filter($scope.partidos, function(o) { 
    	var date = new Date();
    	return date.getTime() < o.fecha;  
    });

    $scope.guardarPrediccion = function(id,idPrediccion,marcador1,marcador2){
    	console.log('guardar',id,idPrediccion,marcador1,marcador2);
    };

  }]);

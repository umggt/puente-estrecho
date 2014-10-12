(function () {
	
	angular.module('app').config(configRoutes);

	function configRoutes($routeProvider) {
		$routeProvider

		.when('/simulador', {
			templateUrl: '/js/app/views/simulador.html',
			controller: 'SimuladorCtrl',
			controllerAs: 'vm'
		})

		.when('/documentacion', {
			templateUrl: 'js/app/views/documentacion.html'
		})

		.otherwise({ redirectTo: '/simulador' })
	}

})();
(function () {
	
	angular.module('app').run(startup);

	function startup($rootScope, $location) {
		$rootScope.location = $location;
	}

})();
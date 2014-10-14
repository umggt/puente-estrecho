(function () {

    angular.module('app').factory('Puente', PuenteFactory);

    function PuenteFactory() {
    	return Puente;
    }

 	function Puente() {
        var self = this;

        self.top = 170;
        self.height = 158;
        self.bottom = self.top + self.height;
    }

})();
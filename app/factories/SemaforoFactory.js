(function () {

    angular.module('app').factory('Semaforo', SemaforoFactory);

    function SemaforoFactory() {
        return Semaforo;
    }

    function Semaforo() {

        var self = this;
        var verde = false;

        self.verde = function () { return verde; };
        self.rojo = function () { return !verde; };

        self.permitirPaso = function () {
            verde = true;
        }

        self.bloquearPaso = function () {
            verde = false;
        }
    }

})();
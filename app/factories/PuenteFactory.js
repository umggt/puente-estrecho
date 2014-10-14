(function () {

    angular.module('app').factory('Puente', PuenteFactory);

    function PuenteFactory() {
        return Puente;
    }

    function Puente() {
        var self = this;

        var capacidad = 3;

        self.top = 170;
        self.height = 158;
        self.bottom = self.top + self.height;
        self.solicitarPaso = solicitarPaso;
        self.notificarSalida = notificarSalida;

        self.colaSubida = [];
        self.colaBajada = [];

        self.subiendo = [];
        self.bajando = [];

        function solicitarPaso(carro) {


            carro.esperar();

            if (carro.deSubida) {
                if (self.bajando.length == 0 && self.subiendo.length + self.colaSubida.length < capacidad) {
                    carro.cruzar();
                    self.subiendo.push(carro);
                    console.log('carro subiendo.');
                } else if (self.colaSubida.indexOf(carro) == -1) {
                    self.colaSubida.push(carro);
                    console.log('carro en espera de subir.');
                }
            } else {
                if (self.subiendo.length == 0 && self.bajando.length + self.colaBajada.length < capacidad) {
                    carro.cruzar();
                    self.bajando.push(carro);
                    console.log('carro bajando.');
                } else if (self.colaBajada.indexOf(carro) == -1) {
                    
                    self.colaBajada.push(carro);
                    console.log('carro en espera de bajar.');
                }
            }

        }

        function notificarSalida(carro) {
            if (carro.deSubida) {
                eliminarItem(self.subiendo, carro);
                console.log('carro terminando de subir.');
            } else {
                eliminarItem(self.bajando, carro);
                console.log('carro terminando de bajar.');
            }
        }

        function eliminarItem(cola, item) {
            var index = cola.indexOf(item);
            cola.splice(index, 1);
        }
    }

})();
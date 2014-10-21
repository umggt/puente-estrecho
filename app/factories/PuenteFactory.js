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
            var otroCarro = null;

            if (carro.deSubida) {
                eliminarItem(self.subiendo, carro);
                
                if (self.colaBajada.length === 0 && self.colaSubida.length > 1){
                    otroCarro = self.colaSubida[self.colaSubida.length -1];
                    eliminarItem(self.colaSubida, otroCarro);
                    solicitarPaso(otroCarro);
                } else if (self.colaBajada.length > 0) {
                    otroCarro = self.colaBajada[self.colaBajada.length -1];
                    eliminarItem(self.colaBajada, otroCarro);
                    solicitarPaso(otroCarro);
                }

            } else {
                eliminarItem(self.bajando, carro);

                if (self.colaSubida.length === 0 && self.colaBajada.length > 1){
                    otroCarro = self.colaBajada[self.colaBajada.length -1];
                    eliminarItem(self.colaBajada, otroCarro);
                    solicitarPaso(otroCarro);
                } else if (self.colaSubida.length > 0) {
                    otroCarro = self.colaSubida[self.colaSubida.length -1];
                    eliminarItem(self.colaSubida, otroCarro);
                    solicitarPaso(otroCarro);
                }
                
            }
        }

        function eliminarItem(cola, item) {
            var index = cola.indexOf(item);
            cola.splice(index, 1);
        }
    }

})();
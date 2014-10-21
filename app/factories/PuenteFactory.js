(function () {

    angular.module('app').factory('Puente', PuenteFactory);

    function PuenteFactory() {
        return Puente;
    }

    function Puente(Semaforo) {
        var self = this;

        var capacidad = 3;

        self.top = 170;
        self.height = 158;
        self.bottom = self.top + self.height;
        self.solicitarPaso = solicitarPaso;
        self.notificarSalida = notificarSalida;
        self.semaforoSuperior = new Semaforo();
        self.semaforoInferior = new Semaforo(); 

        self.colaSubida = [];
        self.colaBajada = [];

        self.subiendo = [];
        self.bajando = [];

        self.hanSubido = 0;
        self.hanBajado = 0;


        function solicitarPaso(carro) {

            console.log('han subido ' + self.hanSubido + ' han bajado ' + self.hanBajado);
            carro.esperar();

            if (carro.deSubida) {
                if (self.bajando.length == 0 && (self.subiendo.length + self.colaSubida.length < capacidad) && (self.hanSubido < capacidad || self.colaBajada.length === 0)) {
                    self.semaforoInferior.permitirPaso();
                    self.hanSubido++;
                    carro.cruzar();
                    self.subiendo.push(carro);
                    if (self.hanSubido >= capacidad) {
                        self.semaforoInferior.bloquearPaso();
                    }
                    console.log('carro subiendo.');
                } else if (self.colaSubida.indexOf(carro) == -1) {
                    self.semaforoInferior.bloquearPaso();
                    self.hanSubido = 0;
                    self.colaSubida.push(carro);
                    console.log('carro en espera de subir.');
                }
            } else {
                if (self.subiendo.length == 0 && (self.bajando.length + self.colaBajada.length < capacidad) && (self.hanBajado < capacidad || self.colaSubida.length === 0)) {
                    self.semaforoSuperior.permitirPaso();
                    self.hanBajado++;
                    carro.cruzar();
                    self.bajando.push(carro);
                    if (self.hanBajado >= capacidad) {
                        self.semaforoSuperior.bloquearPaso();
                    }
                    console.log('carro bajando.');
                } else if (self.colaBajada.indexOf(carro) == -1) {
                    self.semaforoSuperior.bloquearPaso();
                    self.hanBajado = 0;
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
(function () {

    angular.module('app').factory('Carro', CarroFactory);

    function CarroFactory() {
        return Carro;
    }

    function Carro(puente, direccion, carroAlFrente) {

        var self = this;
        var espacio = 3;
        var anchoInicial = 17;
        var altoInicial = 32;
        var escenarioHeight = 500;
        var margenCarril = 100;
        var anchoCarril = 100;
        var centroDeSubida = (anchoCarril * 2) + (margenCarril - anchoInicial) + (anchoInicial / 2);
        var centroDeBajada = (anchoCarril * 1) + (margenCarril - anchoInicial) + (anchoInicial / 2);
        var llegoAlBordeSuperior = false;
        var salioDelBordeInferior = false;
        var llegoAlBordeInferior = false;
        var salioDelBordeSuperior = false;

        self.visible = true;
        self.esperando = false;
        self.cruzando = false;
        self.deSubida = direccion === Carro.d.subida,
        self.height = altoInicial;
        self.width = anchoInicial;
        self.left = left();
        self.top = top();

        self.estilo = 'estilo-' + Math.floor((Math.random() * 18) + 1);

        self.style = {};

        self.draw = draw;
        self.esperar = esperar;
        self.cruzar = cruzar;

        function draw() {

            if (carroAlFrente && !carroAlFrente.visible) {
                carroAlFrente = null;
            }

            if (self.deSubida){
                drawSubida();
            } else {
                drawBajada();
            }

            updateStyle();

        }

        function esperar() {
            self.esperando = true;
        }

        function cruzar() {
            self.esperando = false;
            self.cruzando = true;
        }

        // calcula las nuevas coordenadas para dibujar un carro de bajada.
        function drawBajada() {

            if (carroAlFrente && carroAlFrente.visible && (self.top + self.height + espacio) >= carroAlFrente.top) {
                self.top = carroAlFrente.top - (self.height + espacio);
                return;
            }

            if (self.top >= escenarioHeight) {
                self.visible = false;
                return;
            }

            if (llegaBordeSuperior() && !self.esperando && !llegoAlBordeSuperior) {
                // si el carro llega a la parte superior del puente,
                // se mueve el carro al centro del puente.
                //self.left = centroDeBajada + (anchoCarril / 2);
                llegoAlBordeSuperior = true;
                puente.solicitarPaso(self);
                return;
            }

            if (self.esperando) {
                return;
            }

            if (saleBordeInferior() && self.cruzando && !salioDelBordeInferior) {
                self.cruzando = false;
                salioDelBordeInferior = true;
                puente.notificarSalida(self);
            }

            if (self.cruzando) {
                centrarEnPuente();
            } else {
                centrarEnCarril();
            }

            self.top++;
        }

        // calcula las nuevas coordenadas para dibujar un carro de subida.
        function drawSubida() {

            if (carroAlFrente && carroAlFrente.visible && (self.top - espacio) <= (carroAlFrente.top + carroAlFrente.height)) {
                self.top = (carroAlFrente.top + carroAlFrente.height) + espacio;
                return;
            }

            if (self.top + self.height <= 0) {
                self.visible = false;
                return;
            }

            if (llegaBordeInferior() && !self.esperando && !llegoAlBordeInferior) {
                // si el carro llega a la parte inferior del puente,
                // se mueve el carro al centro del puente.
                //self.left = centroDeSubida - (anchoCarril / 2);
                llegoAlBordeInferior = true;
                puente.solicitarPaso(self);
                return;
            }

            if (self.esperando) {
                return;
            }

            if (saleBordeSuperior() && !salioDelBordeSuperior) {
                self.cruzando = false;
                salioDelBordeSuperior = true;
                puente.notificarSalida(self);
            }

            if (self.cruzando) {
                centrarEnPuente();
            } else {
                centrarEnCarril();
            }

            self.top--;
        }

        // Indica si el carro de bajada ha llegado a la parte superior del puente
        function llegaBordeSuperior() {
            // para saber si un carro (de bajada) ha llegado a la parte superior
            // del puente, se obtienen las coordenadas en donde se encuentra su
            // "trompa" y se compara si estan en la misma corrdenada donde inicia 
            // el puente.
            return self.top + self.height >= puente.top;
        }

        function saleBordeInferior() {
            return self.top >= puente.bottom;
        }

        // Indica si el carro de subida ha llegado a la parte inferior del puente
        function  llegaBordeInferior() {
            // para saber si un carro (de subida) ha llegado a la parte inferior
            // del puente, se obtienen las coordenadas en donde se encuentra su
            // "trompa" y se compara si estan en la misma corrdenada donde finaliza 
            // el puente.
            return self.top <= puente.bottom;
        }

        function saleBordeSuperior() {
            return self.top + self.height <= puente.top;
        }

        // Obtiene la coordenada inicial en 'y' para el carro.
        function top() {

            // si el carro es de subida, entonces la coordenada en y
            // será igual al alto del escenario menos el alto del carro.
            // si el carro es de bajada, entonces la coordenada en y
            // será cero.
            return self.deSubida ? escenarioHeight - self.height : 0;
        }

        // Obtiene la coordenada inicial en 'x' para el carro.
        function left() {
            return self.deSubida ? centroDeSubida : centroDeBajada;
        }

        function centrarEnPuente() {
            self.left = self.deSubida ? centroDeSubida - 50 : centroDeBajada + 50;
        }

        function centrarEnCarril() {
            self.left = left();
        }

        function updateStyle() {
            self.style.height = self.height;
            self.style.width = self.width;
            self.style.left = self.left;
            self.style.top = self.top;
        }
    }

    Carro.d = {
        bajada: "bajada",
        subida: "subida"
    };

})();
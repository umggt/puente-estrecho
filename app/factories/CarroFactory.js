(function () {

    angular.module('app').factory('Carro', CarroFactory);

    function CarroFactory() {
    	return Carro;
    }

    function Carro(puente, direccion, carroAlFrente) {

        var self = this;
        var espacio = 3;
        var anchoInicial = 10;
        var altoInicial = 10;
        var escenarioHeight = 500;
        var margenCarril = 100;
        var anchoCarril = 100;
        var centroDeSubida = (anchoCarril * 2) + (margenCarril - anchoInicial) + (anchoInicial / 2);
        var centroDeBajada = (anchoCarril * 1) + (margenCarril - anchoInicial) + (anchoInicial / 2);

        self.deSubida = direccion === Carro.d.subida,
        self.height = anchoInicial;
        self.width = altoInicial;
        self.left = left();
        self.top = top();

        self.style = {};

        self.draw = draw;

        function draw() {
            if (self.deSubida){
                drawSubida();
            } else {
                drawBajada();
            }
            updateStyle();
        }

        // calcula las nuevas coordenadas para dibujar un carro de bajada.
        function drawBajada() {

            if (carroAlFrente && (self.top + self.height + espacio) >= carroAlFrente.top) {
                self.top = carroAlFrente.top - (self.height + espacio);
                return;
            }

            var maxTop = escenarioHeight - self.height;
            if (self.top >= maxTop) {
                // si el carro llega al final del escenario, finalizar.
                return;
            }

            if (llegaBordeSuperior()) {
                // si el carro llega a la parte superior del puente,
                // se mueve el carro al centro del puente.
                //self.left = centroDeBajada + (anchoCarril / 2);
                return;
            }

            self.top++;
        }

        // calcula las nuevas coordenadas para dibujar un carro de subida.
        function drawSubida() {

            if (carroAlFrente && (self.top - espacio) <= (carroAlFrente.top + carroAlFrente.height)) {
                self.top = (carroAlFrente.top + carroAlFrente.height) + espacio;
                return;
            }

            if (self.top <= 0) {
                // si el carro llega al final del escenario, finalizar.
                return;
            }

            if (llegaBordeInferior()) {
                // si el carro llega a la parte inferior del puente,
                // se mueve el carro al centro del puente.
                //self.left = centroDeSubida - (anchoCarril / 2);
                return;
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

        // Indica si el carro de subida ha llegado a la parte inferior del puente
        function  llegaBordeInferior() {
            // para saber si un carro (de subida) ha llegado a la parte inferior
            // del puente, se obtienen las coordenadas en donde se encuentra su
            // "trompa" y se compara si estan en la misma corrdenada donde finaliza 
            // el puente.
            return self.top <= puente.bottom;
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
(function () {

    angular.module('app').controller('SimuladorCtrl', SimuladorCtrl);

    function SimuladorCtrl($interval, $log, $location) {

        var vm = this;
        vm.fps = 50; // 50 frames por segundo.
        vm.intervalId = null;
 
        vm.colaSubida = [];
        vm.colaBajada = [];

        vm.colaSubiendo = [];
        vm.colaBajando = [];

        vm.agregarCarroBajada = agregarCarroBajada;
        vm.agregarCarroSubida = agregarCarroSubida;

        vm.playPause = playPause;

        var puente = new Puente();

        function agregarCarroBajada() {
            var ultimo = vm.colaBajada.length > 0 ? vm.colaBajada[vm.colaBajada.length - 1] : null; 
            var carro = new Carro(puente, Carro.d.bajada, ultimo);
            vm.colaBajada.push(carro);
        }

        function agregarCarroSubida() {
            var carro = new Carro(puente, Carro.d.subida);
            vm.colaSubida.push(carro);
        }

        function init() {
            play();
        }

        function play() {
            vm.intervalId = $interval(loop, 1000 / vm.fps);
        }

        function pause() {
            if (vm.intervalId) {
                $interval.cancel(vm.intervalId);
                vm.intervalId = null;
            }
        }

        function playPause() {
            if (!vm.intervalId) {
                play();
            }
            else {
                pause();
            }
        }

        function draw() {
            drawCarrosEnCola(vm.colaSubida);
            drawCarrosEnCola(vm.colaBajada);
        }

        function drawCarrosEnCola(cola){
            for (var i = cola.length - 1; i >= 0; i--) {
                var c = cola[i];
                c.draw(i);
            };
        }

        function loop() {

            if ($location.path() !== '/simulador') {
                pause();
                return;
            }

            draw();
        }

        init();
    }

    function Puente() {
        var self = this;

        self.top = 170;
        self.height = 158;
        self.bottom = self.top + self.height;
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

        function draw(i) {
            if (self.deSubida){
                drawSubida(i);
            } else {
                drawBajada(i);
            }
            updateStyle();
        }

        // calcula las nuevas coordenadas para dibujar un carro de bajada.
        function drawBajada (i) {

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
                self.left = centroDeBajada + (anchoCarril / 2);
                return;
            }

            self.top++;
        }

        // calcula las nuevas coordenadas para dibujar un carro de subida.
        function drawSubida (i) {

            var top = topDeSubida(i);

            if (top <= 0) {
                // si el carro llega al final del escenario, finalizar.
                return;
            }

            if (llegaBordeInferior(top)) {
                // si el carro llega a la parte inferior del puente,
                // se mueve el carro al centro del puente.
                self.left = centroDeSubida - (anchoCarril / 2);
                return;
            }

            self.top--;
        }

        // Indica si el carro de bajada ha llegado a la parte superior del puente
        function llegaBordeSuperior(top) {
            // para saber si un carro (de bajada) ha llegado a la parte superior
            // del puente, se obtienen las coordenadas en donde se encuentra su
            // "trompa" y se compara si estan en la misma corrdenada donde inicia 
            // el puente.
            return self.top + self.height >= puente.top;
        }

        // Indica si el carro de subida ha llegado a la parte inferior del puente
        function  llegaBordeInferior (top) {
            // para saber si un carro (de subida) ha llegado a la parte inferior
            // del puente, se obtienen las coordenadas en donde se encuentra su
            // "trompa" y se compara si estan en la misma corrdenada donde finaliza 
            // el puente.
            return top <= puente.bottom;
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

        function topDeSubida(i) {
            return -1 * self.height * i + self.top;
        }

        function margenDeBajada (i) {
            return self.height * i;
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
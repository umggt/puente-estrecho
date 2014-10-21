(function () {

    angular.module('app').controller('SimuladorCtrl', SimuladorCtrl);

    function SimuladorCtrl($interval, $log, $location, Carro, Puente) {

        var vm = this;
        vm.fps = 50; // 50 frames por segundo.
        vm.intervalId = null;
 
        vm.colaSubida = [];
        vm.colaBajada = [];

        vm.colaSubiendo = [];
        vm.colaBajando = [];

        vm.agregarCarroBajada = agregarCarroBajada;
        vm.agregarCarroSubida = agregarCarroSubida;
        vm.generarActivo = true;

        vm.playPause = playPause;

        var puente = new Puente();

        function agregarCarroBajada() {
            agregarACola(vm.colaBajada, Carro.d.bajada);
        }

        function agregarCarroSubida() {
            agregarACola(vm.colaSubida, Carro.d.subida);
        }

        function agregarACola(cola, direccion) {
            var ultimo = cola.length > 0 ? cola[cola.length - 1] : null; 
            var carro = new Carro(puente, direccion, ultimo);
            cola.push(carro);
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
            var i;
            var carrosPorEliminar = [];
            for (i = 0; i < cola.length; i++) {
                var carro = cola[i];

                if (carro.visible) {
                    carro.draw();   
                } else {
                    carrosPorEliminar.push(i);
                }
            };

            for (i = 0; i < carrosPorEliminar.length; i++) {
                var index = carrosPorEliminar[i];
                cola.splice(index, 1);
            };
        }

        function loop() {

            if ($location.path() !== '/simulador') {
                pause();
                return;
            }

            generarCarroAleatorio();

            draw();
        }

        function generarCarroAleatorio() {
            if (!vm.generarActivo) {
                return;
            }

            var numero = generarRandom();
            if (numero === 98) {
                vm.agregarCarroSubida();
            } else if (numero === 14) {
                vm.agregarCarroBajada();
            }
        }

        function generarRandom() {
            return Math.floor((Math.random() * 100) + 1);
        }

        init();
    }
})();
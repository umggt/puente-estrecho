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



        function init() {
            start();
        }

        function start() {
            vm.intervalId = $interval(loop, 1000 / vm.fps);
        }

        function pause() {
            if (vm.intervalId) {
                $interval.cancel(vm.invervalId);
            }
        }

        function draw() {
            
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

})();
/**
 * assets/js/controllers/BodyCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller per gestire l'elemento body della pagina html. 
 * In particolare è utile per capire quando il mouse lascia 
 * l'elemento body.
 */
angular.module('BodyCtrl', []).controller('BodyCtrl', [
    '$scope',
    '$uibModal',
    '$timeout',
    'User',
    function ($scope, $uibModal, $timeout, User) {
        /**
         * Vari tipi di messaggi mostrati quando l'utente sta per abbandonare
         * il sito.
         * Vengono scelti in modo casuale ogni volta.
         */
        var messages = [
            "Ogni ricetta su Tastysnap è corredata di valori nutrizionali.",
            "Su Tastysnap puoi creare raccolte private e visibile soltante a te.",
            "Su Tastysnap puoi esplorare le ricette che vengono pubblicate nella tua zona.",
            "Su Tastysnap puoi cercare ricette in base ai valori nutrizionali.",
            "Su Tastysnap puoi cercare ricette in base agli ingredienti che ami.",
            "Su Tastysnap puoi cercare ricette in base ai tempi di preparazione.",
            ];

        var retainModalOpened = false;
        var timer;

        // mouseenter event
        $scope.showIt = function () {
            // aspetto prima di mostrare la modale
            timer = $timeout(function () {
                openRetainModal();
            }, 500);
        };

        // mouseleave event
        $scope.hideIt = function () {
            // se il mouse rientra sul sito allora annullo
            // l'intenzione di mostrare la modale
            $timeout.cancel(timer);
        };

        /**
         * Funzione per mostrare la modale che
         * dovrebbe non far andare via l'utente dal sito.
         */
        var openRetainModal = function () {
            if (!retainModalOpened) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/retain_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        // Prendo un messaggio casuale tra quelli disponibili
                        var item = messages[Math.floor(Math.random()*messages.length)];
                        $scope.msg = item;

                        // azioni possibili all'interno della modale
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'md'
                });

                modalInstance.opened.then(function () {
                    retainModalOpened = true;
                });

                modalInstance.result.then(null, function () {
                    console.info('Modal dismissed at: ' + new Date());
                    retainModalOpened = false;
                    // salvataggio della data di visualizzazione della modale
                    //UserEngagement.saveDate(UserEngagement.date_strings[0], new Date());
                });
            }
        }



    }]);
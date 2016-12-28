/**
 * assets/admin_assets/js/controllers/CollectionMngmntCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le collection.
 */
angular.module('CollectionMngmntCtrl', [])
    .controller('CollectionMngmntCtrl', [
        '$scope',
        'Collection',
        '$uibModal',
        function ($scope, Collection, $uibModal) {

            $scope.collections = Collection.collections;

            $scope.openEliminationModal = function (selectedCollection) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/collection_elimination_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.loading = false;
                        $scope.selectedCollection = selectedCollection;
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true

                            Collection.delete(selectedCollection.id,
                                function (response) {
                                    //do what you need here
                                    $scope.loading = false;
                                    $uibModalInstance.dismiss('cancel');

                                }, function (response) {
                                    // errore
                                    $scope.loading = false;
                                });
                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: 'sm'
                });
            };

        }
    ]);
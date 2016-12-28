/**
 * assets/admin_assets/js/controllers/UserMngmntCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con le collection.
 */
angular.module('UserMngmntCtrl', [])
    .controller('UserMngmntCtrl', [
        '$scope',
        'User',
        '$uibModal',
        function ($scope, User, $uibModal) {

            $scope.users = User.users;

            $scope.openEliminationModal = function (selectedUser) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'admin_assets/templates/user_delete_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.loading = false;
                        $scope.selectedUser = selectedUser;
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true

                            User.delete(selectedUser,
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
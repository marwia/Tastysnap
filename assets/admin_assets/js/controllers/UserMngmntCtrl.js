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
        'User', 'Auth',
        '$uibModal',
        function ($scope, User, Auth, $uibModal) {

            
            // pagination variables
            $scope.totalItems = User.usersCount;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 30;

            $scope.users = User.users;

            $scope.$watch("currentPage", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    console.log("called due initialization");
                } else if (newValue != oldValue) {
                    console.info("currentPage", $scope.currentPage);
                    User.getUsers(($scope.currentPage -1) * $scope.itemsPerPage, true);
                }
            }, true);

            $scope.isInvitationRequired = Auth.isInvitationRequired;

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
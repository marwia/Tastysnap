/**
 * assets/admin_assets/js/controllers/ProductMngmntCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per interagire con gli ingredienti.
 */
angular.module('ProductMngmntCtrl', [])
    .controller('ProductMngmntCtrl', [
        '$scope',
        'Product',
        '$uibModal',
        function ($scope, Product, $uibModal) {

            // pagination variables
            $scope.totalItems = Product.productsCount;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 30;

            $scope.products = Product.products;

            $scope.$watch("currentPage", function (newValue, oldValue) {
                if (newValue === oldValue) {
                    console.log("called due initialization");
                } else if (newValue != oldValue) {
                    console.info("currentPage", $scope.currentPage);
                    Product.getProducts(null, ($scope.currentPage -1) * $scope.itemsPerPage, true);
                }
            }, true);

            $scope.openEliminationModal = function (selectedProduct) {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'admin_assets/templates/product_delete_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.loading = false;
                        $scope.selectedProduct = selectedProduct;
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true;

                            Product.delete(selectedProduct.id,
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

            $scope.openAddModal = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'admin_assets/templates/product_add_modal.html',
                    controller: function ($uibModalInstance, $scope) {
                        // passaggio paramteri
                        $scope.ingredientGroups = Product.groups;
                        $scope.loading = false;
                        $scope.product = {
                            "portions": [
                                {
                                    "g": 0,
                                    "amt": "1",
                                    "unit": "tbsp"
                                },
                                {
                                    "g": 0,
                                    "amt": "1",
                                    "unit": "cup"
                                }
                            ],
                            "name": {
                                "sci": "",
                                "common": [],
                                "long": ""
                            },
                            "nutrients": [
                                {
                                    "units": "g",
                                    "code": "203",
                                    "name": "Protein",
                                    "value": 0,
                                    "abbr": "PROCNT"
                                },
                                {
                                    "units": "g",
                                    "code": "204",
                                    "name": "Total lipid (fat)",
                                    "value": 0,
                                    "abbr": "FAT"
                                },
                                {
                                    "units": "g",
                                    "code": "205",
                                    "name": "Carbohydrate, by difference",
                                    "value": 0,
                                    "abbr": "CHOCDF"
                                },
                                {
                                    "units": "kcal",
                                    "code": "208",
                                    "name": "Energy",
                                    "value": 0,
                                    "abbr": "ENERC_KCAL"
                                },
                                {
                                    "units": "g",
                                    "code": "221",
                                    "name": "Alcohol, ethyl",
                                    "value": 0,
                                    "abbr": "ALC"
                                },
                                {
                                    "units": "g",
                                    "code": "255",
                                    "name": "Water",
                                    "value": 0,
                                    "abbr": "WATER"
                                },
                                {
                                    "units": "mg",
                                    "code": "262",
                                    "name": "Caffeine",
                                    "value": 0,
                                    "abbr": "CAFFN"
                                },
                                {
                                    "units": "g",
                                    "code": "269",
                                    "name": "Sugars, total",
                                    "value": 0,
                                    "abbr": "SUGAR"
                                },
                                {
                                    "units": "g",
                                    "code": "291",
                                    "name": "Fiber, total dietary",
                                    "value": 0,
                                    "abbr": "FIBTG"
                                },
                                {
                                    "units": "mg",
                                    "code": "301",
                                    "name": "Calcium, Ca",
                                    "value": 0,
                                    "abbr": "CA"
                                },
                                {
                                    "units": "mg",
                                    "code": "303",
                                    "name": "Iron, Fe",
                                    "value": 0,
                                    "abbr": "FE"
                                },
                                {
                                    "units": "mg",
                                    "code": "304",
                                    "name": "Magnesium, Mg",
                                    "value": 0,
                                    "abbr": "MG"
                                },
                                {
                                    "units": "mg",
                                    "code": "305",
                                    "name": "Phosphorus, P",
                                    "value": 0,
                                    "abbr": "P"
                                },
                                {
                                    "units": "mg",
                                    "code": "306",
                                    "name": "Potassium, K",
                                    "value": 0,
                                    "abbr": "K"
                                },
                                {
                                    "units": "mg",
                                    "code": "307",
                                    "name": "Sodium, Na",
                                    "value": 0,
                                    "abbr": "NA"
                                },
                                {
                                    "units": "mg",
                                    "code": "309",
                                    "name": "Zinc, Zn",
                                    "value": 0,
                                    "abbr": "ZN"
                                },
                                {
                                    "units": "g",
                                    "code": "606",
                                    "name": "Fatty acids, total saturated",
                                    "value": 0,
                                    "abbr": "FASAT"
                                }
                            ],
                            "meta": {
                                "ref_per": "0",
                                "ref_desc": "",
                                "fat_factor": "0",
                                "carb_factor": "0",
                                "protein_factor": "0",
                                //"ndb_no": 1001,
                                "footnotes": [],
                                //"fndds_survey": "Y",
                                "langual": [],
                                "nitrogen_factor": "0"
                            },
                            "group": "",
                            "manufacturer": ""
                        };
                        // azioni possibili all'interno della modale
                        $scope.ok = function () {
                            $scope.loading = true;

                            Product.create($scope.product, function (response) {
                                // success
                                $scope.loading = false;
                                $uibModalInstance.dismiss('cancel');
                            }, function (response) {
                                // error
                                $scope.loading = false;
                            })

                        };

                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    resolve: {
                        ingredientGroups: function () {
                            return Product.getProductGroups();
                        }
                    },
                    size: 'lg'
                });
            };

        }
    ]);
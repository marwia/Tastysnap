/**
 * assets/js/controllers/RecipeCreateCtrl.js
 *
 * Mariusz Wiazowski
 *
 * Controller usato per la creazione di una ricetta.
 */
angular.module('RecipeCreateCtrl', []).controller('RecipeCreateCtrl', [
    '$scope', // lo scope
    '$state', // gestione degli stati dell'app (ui-router)
    'Recipe', // servizio per le ricette
    'Product', // servizio per i prodotti
    'Ingredient', // servizio per gli ingredienti
    'RecipeStep', // servizio per i passi
    'Auth', // servizio per l'autenticazione
    'ImageUtils',
    '$filter',
    'FileUploader', // per il file upload
    '$http',
    'Utils',
    '$window',
    'ngGPlacesAPI',
    '$uibModal',
    function ($scope, $state, Recipe, Product, Ingredient, RecipeStep, Auth, ImageUtils, $filter, FileUploader, $http, Utils, $window, ngGPlacesAPI, $uibModal) {

        // determino se sono in modalità modifica o creazione controllando l'url
        $scope.editMode = $state.current.name.indexOf('app.recipe_edit') > -1;

        // espongo allo scope il metodo di auth chiamato "isLoggedIn"
        $scope.isLoggedIn = Auth.isLoggedIn;

        // espongo le categorie delle ricette estraendole dal servizio
        // il caricamento della categorie viene eseguito ad ogni
        // ingresso nello stato in cui si crea una ricetta
        $scope.recipeCategories = Recipe.recipeCategories;

        // espongo il tipo di dosaggio preso sempre dal servizio dedicato alle ricette
        $scope.dosageTypes = Recipe.dosagesTypes;

        // espongo il metodo per ricercare i prodotti per nome
        $scope.searchProductsByName = Product.searchProductsByName;

        // espongo soltanto le unità di misura tradotte
        $scope.translatedUnitsOfMeasure = Ingredient.translatedUnitsOfMeasure;

        // variabili per tenere traccia del completameto della crezione/modifica di una ricetta
        $scope.progressSum = 1;
        $scope.progress = 0;
        $scope.finish = false;

        $scope.isCreating = false;

        // serve a tenere conto del caricamento della ricetta
        $scope.loadingProgress = 0;

        // Ritorna il colore dominante del canvas che contiene
        // la prima delle immagini caricate
        $scope.getCoverImageDominanatColor = Utils.getCoverImageDominanatColor;

        $scope.recipePlace = "";
        $scope.recipePlaceSearchResult = "";
        $scope.recipeDetailedPlace = {};

        $scope.placeValidate = function () {
            if ($scope.recipePlace == "") {
                // No text entered
                return true;
            } else if ($scope.recipePlace == $scope.recipePlaceSearchResult) {
                // Success
                return true;
            } else if ($scope.recipePlace != "" && $scope.recipeToCreate.googlePlaceRef != "") {
                // la ricetta è in modifica ma la posizione non è stata alterata
                return true;
            } else {
                // place info and search text do not match, perform manual lookup   
                // when lookup is complete, the callback function will store the place info
                // and resubmit the form
                $scope.recipePlace = "";
            }
            return false;
        };

        /**
         * Funzione che scatta quando viene selezionata una unità di misura,
         * serve ad azzerare la quantità in caso di unità "indefinite".
         */
        $scope.onUnitOfMeasureSelect = function (item, ingredient) {
            if (item == 'qb' || item == 'pizzico')
                ingredient.quantity = "";
        }

        /**
         * Funzione che lega il prodotto selezionato dall'utente
         * all'ingrediente.
         */
        $scope.onProductSelect = function (item, ingredient) {
            ingredient.product = item;
        };

        $scope.recipeToCreate = {
            title: "",
            preparationTime: null,
            dosagesFor: "",
            dosagesType: "",
            category: "",
            description: "",
            coverImageUrl: "",
            dominantColor: "",
            blurredCoverImageUrl: "",
        };

        $scope.ingredient_groups =
            [{
                name: "",
                ingredients: [{
                    name: "",
                    quantity: "",
                    unitOfMeasure: "",
                    product: "",
                    noProduct: false
                }]
            }];

        $scope.recipe_steps =
            [{
                seq_number: 1,
                description: ""
            }];

        // metodo per aggiungere banalmente un gruppo di ingredienti
        $scope.addIngredientGroup = function () {
            $scope.ingredient_groups
                .push({
                    name: "",
                    ingredients: [{
                        name: "",
                        quantity: "",
                        unitOfMeasure: "",
                        product: {},
                        noProduct: false
                    }]
                });
        };

        $scope.removeIngredientGroup = function (group_index) {
            $scope.ingredient_groups.splice(group_index, 1);
        };

        $scope.addIngredient = function (group_index) {
            $scope.ingredient_groups[group_index].ingredients.push({
                name: "",
                quantity: "",
                unitOfMeasure: "",
                product: {},
                noProduct: false
            });
        };

        $scope.onSelect = function ($item, $model, $label, ingredient) {
            $scope.$item = $item;
            $scope.$model = $model;
            $scope.$label = $label;
            ingredient.product = $item;
        };

        /**
         * Rimuovi un ingrediente da un gruppo di ingredienti.
         */
        $scope.removeIngredient = function (group_index, ingredient_index) {
            $scope.ingredient_groups[group_index].ingredients.splice(ingredient_index, 1);
        };

        // metodo per aggiungere banalmente un passo alla ricetta
        $scope.addRecipeStep = function () {
            $scope.recipe_steps
                .push({
                    seq_number: null,
                    description: ""
                });
        };
        // metodo per rimuovere un passo della ricetta
        $scope.removeRecipeStep = function (step_index) {
            $scope.recipe_steps.splice(step_index, 1);
        }

        /**
         * Esegui l'upload di tutte le immagini in attesa di upload.
         */
        $scope.createRecipe = function () {

            $scope.isCreating = true;
            // default value for new recipe...
            $scope.recipeToCreate.ingredientState = "ok";

            // mostro la finestra modale con il caricamento
            $scope.progressModalInstance = $scope.openProgressModal();

            // calcolo del totale delle create che saranno eseguite
            $scope.progressSum = 1 // ricetta stessa
                + coverImageUploader.queue.length * 2 // immagine di copertina + quella sfocata
                + otherImageUploader.queue.length // altre immagini
                + $scope.ingredient_groups.length // gruppi di ingredienti
                + $scope.recipe_steps.length; // numero di passi nella preparazione

            for (var i in $scope.ingredient_groups) {
                $scope.progressSum += $scope.ingredient_groups[i].ingredients.length // numero di ingredienti di ogni gruppo

                //Calcolo delle creazioni di nuovi prodotti 
                //oppure della modifica di prodotti creati dall'utente
                for (var j in $scope.ingredient_groups[i].ingredients) {
                    if ($scope.ingredient_groups[i].ingredients[j].noProduct == true) {
                        $scope.progressSum++;
                        // comunico che questa ricetta dovrà essere controllata dalla redazione
                        $scope.recipeToCreate.ingredientState = "toBeValidate";
                    }
                }
            }



            /**
             * Aggiungi l'eventuale posizione associata alla ricetta,
             * questo soltanto nel caso della creazione di una nuova ricetta oppure
             * nel caso della modifica effettiva della posizione. In caso contrario, nella
             * modifica verrà usata la posizione già presente.
             */
            if ($scope.recipePlace != "" && $scope.recipeDetailedPlace.reference) {
                var coordinates = [
                    $scope.recipeDetailedPlace.longitude,
                    $scope.recipeDetailedPlace.latitude
                ];

                $scope.recipeToCreate.coordinates = coordinates;
                $scope.recipeToCreate.googlePlaceId = $scope.recipeDetailedPlace.place_id;
                $scope.recipeToCreate.googlePlaceRef = $scope.recipeDetailedPlace.reference;
            }

            if ($scope.editMode) {

                // calcolo il totale delle update da eseguire degli steps
                var stepUpdateIdx = 0;
                if ($scope.originalRecipe.steps.length <= $scope.recipe_steps.length)
                    stepUpdateIdx = $scope.originalRecipe.steps.length;
                else
                    stepUpdateIdx = $scope.recipe_steps.length;

                // calcolo il totale delle update da eseguire dei gruppi di ingredienti
                var ingredientGroupUpdateIdx = 0;
                if ($scope.originalRecipe.ingredientGroups.length <= $scope.ingredient_groups.length)
                    ingredientGroupUpdateIdx = $scope.originalRecipe.ingredientGroups.length;
                else
                    ingredientGroupUpdateIdx = $scope.ingredient_groups.length;


                // modifico ricetta
                Recipe.update(angular.copy($scope.recipeToCreate), function (response) {
                    // salvo l'esito della modifica della ricetta
                    $scope.recipeToCreate = response.data;
                    $scope.progress++;
                });

                // altre operazioni...

                // update degli steps
                var stepsToUpdate = $scope.recipe_steps.splice(0, stepUpdateIdx);

                updateRecipeSteps(stepsToUpdate);

                // decido cosa fare con l'eccesso
                if ($scope.originalRecipe.steps.length != $scope.recipe_steps.length + stepUpdateIdx) {
                    if ($scope.originalRecipe.steps.length < $scope.recipe_steps.length + stepUpdateIdx) {// aggiunta nuovi steps (quelli in fondo all'array - in più)
                        createRecipeStepsAlt($scope.recipe_steps, $scope.originalRecipe.steps.length + stepUpdateIdx);
                    }
                    else {// tolta di steps (quelli in fondo all'array - in più)
                        deleteRecipeSteps($scope.originalRecipe.steps.splice(stepUpdateIdx, $scope.originalRecipe.steps.length - stepUpdateIdx));
                    }
                }

                // update dei gruppi di ingredienti

                updateIngredientGroups($scope.ingredient_groups.splice(0, ingredientGroupUpdateIdx));

                // decido cosa fare con l'eccesso
                if ($scope.originalRecipe.ingredientGroups.length != $scope.ingredient_groups.length + ingredientGroupUpdateIdx) {
                    if ($scope.originalRecipe.ingredientGroups.length < $scope.ingredient_groups.length + ingredientGroupUpdateIdx) {// aggiunta nuovi gruppi (quelli in fondo all'array - in più)
                        createIngredientGroupsAlt($scope.ingredient_groups);
                    }
                    else {// tolta di gruppi (quelli in fondo all'array - in più)
                        deleteIngredientGroups($scope.originalRecipe.ingredientGroups.splice(ingredientGroupUpdateIdx, $scope.originalRecipe.ingredientGroups.length - ingredientGroupUpdateIdx));
                    }
                }

                // update delle immagini

                // carico l'immagine di copertina (compresa quella sfocata)
                coverImageUploader.uploadAll();

                // carico le altre immagini aggiuntive
                otherImageUploader.uploadAll();
            }
            else {// creazione di una nuova ricetta

                //crea ricetta
                Recipe.create($scope.recipeToCreate, function (response) {

                    // salvo l'esito della creazione della ricetta
                    $scope.recipeToCreate = response.data;
                    $scope.progress++;

                    // creo i passi per la preparazione
                    createRecipeSteps();

                    // crea gruppi di ingredienti
                    createIngredientGroups();

                    // carico l'immagine di copertina (compresa quella sfocata)
                    coverImageUploader.uploadAll();

                    // carico le altre immagini aggiuntive
                    otherImageUploader.uploadAll();

                });
            }
        };

        /**
         * Osserva la variabile che indica il progresso della creazione della ricetta.
         */
        $scope.$watch("progress", function (newValue, oldValue) {

            if ($scope.progress >= $scope.progressSum) {// fine della creazione della ricetta
                // Attendo 4 secondi prima di chiudere la modale
                setTimeout(function () {
                    $scope.finish = true;
                    $scope.$apply();
                }, 4000);
            }
        });

        $scope.closeModal = function () {
            $scope.progressModalInstance.dismiss('cancel');
            $state.go("app.recipe", { id: $scope.recipeToCreate.id });
        }

        /**
         * Crea tutti i passi per la ricetta.
         */
        function createRecipeSteps() {
            for (var i = 0; i < $scope.recipe_steps.length; i++) {
                // preparo l'oggetto
                $scope.recipe_steps[i].seq_number = i + 1;
                // invio...
                RecipeStep.create(
                    $scope.recipeToCreate,
                    $scope.recipe_steps[i],
                    function () {// success
                        $scope.progress++;
                    });
            }
        }
        // un'altra variante
        function createRecipeStepsAlt(steps, initalSeqNumber) {
            for (var i = 0; i < steps.length; i++) {
                // preparo l'oggetto
                steps[i].seq_number = i + initalSeqNumber;
                // invio...
                RecipeStep.create(
                    $scope.recipeToCreate,
                    steps[i],
                    function () {// success
                        $scope.progress++;
                    });
            }
        }

        /**
         * Aggiorno i passi per la ricetta.
         */
        function updateRecipeSteps(steps) {
            for (var i = 0; i < steps.length; i++) {

                if (steps[i].description.localeCompare($scope.originalRecipe.steps[i].description) == 0)
                    $scope.progress++;// non necessità di update
                else {
                    // preparo l'oggetto
                    steps[i].seq_number = i + 1;
                    steps[i].id = $scope.originalRecipe.steps[i].id;
                    // invio...
                    RecipeStep.update(
                        $scope.recipeToCreate,
                        steps[i],
                        function () {// success
                            $scope.progress++;
                        });
                }
            }
        }

        /**
         * Elimina  i passi per la ricetta.
         */
        function deleteRecipeSteps(steps) {
            for (var i = 0; i < steps.length; i++) {
                // invio...
                RecipeStep.delete(
                    $scope.recipeToCreate,
                    steps[i],
                    function () {// success
                        $scope.progress++;
                    });
            }
        }

        /**
         * Crea tutti gruppi di ingredienti per la ricetta.
         */
        function createIngredientGroups() {
            for (var i = 0; i < $scope.ingredient_groups.length; i++) {

                //Se il gruppo non ha nome allora lo setto a " "
                if (!$scope.ingredient_groups[i].name) {
                    $scope.ingredient_groups[i].name = " ";
                }

                Ingredient.createIngredientGroup(
                    $scope.recipeToCreate,
                    $scope.ingredient_groups[i],
                    createIngredients);// success
            }
        }
        // un'altra variante
        function createIngredientGroupsAlt(groups) {
            for (var i = 0; i < groups.length; i++) {

                //Se il gruppo non ha nome allora lo setto a " "
                if (!groups[i].name) {
                    groups[i].name = " ";
                }

                Ingredient.createIngredientGroup(
                    $scope.recipeToCreate,
                    groups[i],
                    createIngredients);// success
            }
        }

        /**
         * Aggiorna i gruppi per la ricetta.
         */
        function updateIngredientGroups(groups) {
            for (var i = 0; i < groups.length; i++) {

                // se il gruppo è invariato allora non lo aggiorno
                if (groups[i].name.localeCompare($scope.originalRecipe.ingredientGroups[i].name) == 0) {
                    $scope.progress++;
                }
                else {
                    //Se il gruppo non ha nome allora lo setto a " "
                    if (!groups[i].name) {
                        groups[i].name = " ";
                    }
                    // copio l'id orginale
                    groups[i].id = $scope.originalRecipe.ingredientGroups[i].id;

                    Ingredient.updateIngredientGroup(
                        groups[i],
                        function (response) {
                            $scope.progress++;
                        });// success
                }

                updateGroupIngredients(groups[i], i);
            }
        }

        /**
         * Elimina i gruppi per la ricetta.
         */
        function deleteIngredientGroups(groups) {
            for (var i = 0; i < groups.length; i++) {
                // invio...
                Ingredient.deleteIngredientGroup(
                    groups[i],
                    function () {// success
                        $scope.progress++;
                    });
            }
        }

        /**
         * Metodo d'aiuto per ovviare al problema delle 
         * callback e dell'indice
         * @param {Array} ingredientGroup 
         * @param {Number} index 
         */
        function createProduct(ingredientGroup, index) {
            Product.createProduct({
                name: {
                        long: ingredientGroup.ingredients[index].name
                    }
                },
                function (response) {
                    $scope.progress++;
                    // collego il prodotto appena creato con l'ingrediente
                    ingredientGroup.ingredients[index].product = response.data;
                    //crea l'ingrediente
                    Ingredient.createIngredient(
                        ingredientGroup,
                        ingredientGroup.ingredients[index],
                        function (response) {
                            $scope.progress++;
                            console.info(response);
                        });
                });
        }

        /**
         * Metodo d'aiuto per ovviare al problema delle 
         * callback e dell'indice
         * @param {Array} ingredientGroup 
         * @param {Number} index 
         */
        function createProductAndUpdateIngredient(ingredientGroup, ingredient) {
            Product.createProduct({
                name: {
                        long: ingredient.name
                    }
                },
                function (response) {
                    $scope.progress++;
                    // collego il prodotto appena creato con l'ingrediente
                    ingredient.product = response.data;
                    // aggiorno l'ingrediente
                    Ingredient.updateIngredient(
                        ingredientGroup,
                        ingredient,        
                        function (response) {
                            $scope.progress++;
                            console.info(response);
                        });
                });
        }

        /**
         * Crea tutti gli ingredienti per un gruppo di ingredienti.
         */
        function createIngredients(ingredientGroup) {
            $scope.progress++;
            for (var k = 0; k < ingredientGroup.ingredients.length; k++) {

                //TODO: Verificare se si deve creare il nuovo
                // prodotto prima!
                if (ingredientGroup.ingredients[k].noProduct == true) {
                    createProduct(ingredientGroup, k);
                } else {// se non devo creare il prodotto
                    //crea per ogni gruppo di ingredienti gli ingredienti
                    Ingredient.createIngredient(
                        ingredientGroup,
                        ingredientGroup.ingredients[k],
                        function (response) {
                            $scope.progress++;
                            console.info(response);
                        });
                }
            }
        }
        // un'alternativa
        function createIngredientsAlt(ingredientGroup, ingredients) {
            for (var k = 0; k < ingredients.length; k++) {

                if (ingredients[k].noProduct == true) {
                    Product.createProduct({
                        name: ingredients[k].name
                    },
                        function (response) {
                            $scope.progress++;
                            // collego il prodotto appena creato con l'ingrediente
                            ingredients[k].product = response.data;
                            //crea l'ingrediente
                            Ingredient.createIngredient(
                                ingredientGroup,
                                ingredients[k],
                                function (response) {
                                    $scope.progress++;
                                    console.info(response);
                                });
                        });

                } else {// se non devo creare il prodotto
                    //crea per ogni gruppo di ingredienti gli ingredienti
                    Ingredient.createIngredient(
                        ingredientGroup,
                        ingredients[k],
                        function (response) {
                            $scope.progress++;
                            console.info(response);
                        });
                }
            }
        }

        /**
         * Crea tutti gli ingredienti per un gruppo di ingredienti.
         */
        function updateGroupIngredients(ingredientGroup, idx) {

            var originalIngredientGroup = $scope.originalRecipe.ingredientGroups[idx];

            // calcolo il totale delle update da eseguire dei gruppi di ingredienti
            var ingredientUpdateIdx = 0;
            if (originalIngredientGroup.ingredients.length <= ingredientGroup.ingredients.length)
                ingredientUpdateIdx = originalIngredientGroup.ingredients.length;
            else
                ingredientUpdateIdx = ingredientGroup.ingredients.length;

            // update dei gruppi di ingredienti

            // copio i vecchi id da aggiornare
            for (var i = 0; i < ingredientUpdateIdx; i++) {
                ingredientGroup.ingredients[i].id = originalIngredientGroup.ingredients[i].id;
            }

            var ingredientsToUpdate = ingredientGroup.ingredients.splice(0, ingredientUpdateIdx);

            updateIngredients(
                ingredientGroup,
                originalIngredientGroup,
                ingredientsToUpdate);

            // decido cosa fare con l'eccesso
            if (originalIngredientGroup.ingredients.length != ingredientGroup.ingredients.length + ingredientUpdateIdx) {
                if (originalIngredientGroup.ingredients.length < ingredientGroup.ingredients.length + ingredientUpdateIdx) {// aggiunta nuovi gruppi (quelli in fondo all'array - in più)
                    createIngredientsAlt(
                        ingredientGroup,
                        ingredientGroup.ingredients);
                }
                else {// tolta di gruppi (quelli in fondo all'array - in più)
                    deleteIngredients(
                        ingredientGroup,
                        originalIngredientGroup.ingredients
                            .splice(ingredientUpdateIdx, originalIngredientGroup.ingredients.length - ingredientUpdateIdx));
                }
            }

        }

        /**
         * Aggiorna gli ingredienti per la ricetta.
         */
        function updateIngredients(ingredientGroup, originalIngredientGroup, ingredients) {
            for (var i = 0; i < ingredients.length; i++) {

                if (ingredients[i].quantity == originalIngredientGroup.ingredients[i].quantity &&
                    ingredients[i].unitOfMeasure.localeCompare(originalIngredientGroup.ingredients[i].unitOfMeasure) == 0 &&
                    ingredients[i].product.id.localeCompare(originalIngredientGroup.ingredients[i].product.id) == 0 &&
                    ingredients[i].noProduct == false)
                    $scope.progress++;// non necessità di update
                else {
                    /**
                     * Se nell'ingredient è stato cambiato il prodotto con uno
                     * non esistente, allora devo creare quel prodotto.
                     */
                    if(ingredients[i].noProduct == true) {
                        createProductAndUpdateIngredient(ingredientGroup, ingredients[i]);
                    } else {
                        Ingredient.updateIngredient(
                            ingredientGroup,
                            ingredients[i],
                            function () {// success
                                $scope.progress++;
                            });// success
                    }
                }
            }
        }

        /**
         * Elimina gli ingredienti per la ricetta.
         */
        function deleteIngredients(ingredientGroup, ingredients) {
            for (var i = 0; i < ingredients.length; i++) {
                // invio...
                Ingredient.deleteIngredient(
                    ingredientGroup,
                    ingredients[i],
                    function () {// success
                        $scope.progress++;
                    });
            }
        }



        // File uploading (configuration)

        var coverImageUploader = $scope.coverImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });

        var otherImageUploader = $scope.otherImageUploader = new FileUploader({
            alias: 'image',
            method: 'put',
            headers: {
                Authorization: 'Bearer ' + Auth.getToken(),
                'x-csrf-token': $http.defaults.headers.common['x-csrf-token']
            }
        });

        // FILTERS
        var coverImageFilter = {
            name: 'coverImageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 1; // max 1 image
            }
        }

        var otherImageFilter = {
            name: 'otherImageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';

                return '|jpg|png|jpeg|'.indexOf(type) !== -1 // filter file type
                    && this.queue.length < 10; // max 10 images
            }
        }

        // Set filters
        coverImageUploader.filters.push(coverImageFilter);

        // CALLBACKS

        coverImageUploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };

        coverImageUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);

            ImageUtils.reduceImageSizeAndQuality(fileItem._file, 1024, 1024, 0.7, function (canvas, reducedFile) {
                // ottengo l'immagine ridotta
                fileItem._file = reducedFile;
                // ottengo il colore dominante dell'immagine di copertina
                $scope.recipeToCreate.dominantColor = $scope.getCoverImageDominanatColor(canvas);
            });
        };

        coverImageUploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };

        coverImageUploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            // aggiorno dinamicamente l'url per l'upload
            item.url = '/api/v1/recipe/' + $scope.recipeToCreate.id + '/upload_cover_image';
        };

        coverImageUploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };

        coverImageUploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };

        coverImageUploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };

        coverImageUploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.progress++;
            console.info('onCompleteItem', fileItem, response, status, headers);
        };

        coverImageUploader.onCompleteAll = function () {
            console.info('onCompleteAll');

            ImageUtils.reduceImageSizeAndQuality(
                coverImageUploader.queue[0]._file,
                1024, 1024, 0.7,
                function (canvas, reducedFile) {// callback finale
                    // ottengo l'immagine ridotta
                    //fileItem._file = reducedFile;

                    Recipe.uploadBlurImage(reducedFile, $scope.recipeToCreate, function (response) {
                        $scope.progress++;
                        //$scope.recipeToCreate = response.data;
                        console.info($scope.recipeToCreate);

                    }, function (response) {
                        console.info("error", response)
                    });

                }, function (img, canvas) {// ulteriori operazioni sull'immagine
                    // Aggiungo la sfocatura e trasferisco l'immagine sul canvas
                    StackBlur.image(img, canvas, 70, false);
                });
        };

        console.info('uploader', coverImageUploader);

        // Other image uploader

        otherImageUploader.filters.push(otherImageFilter);

        otherImageUploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            ImageUtils.reduceImageSizeAndQuality(fileItem._file, 1024, 1024, 0.7, function (canvas, reducedFile) {
                // ottengo l'immagine ridotta
                fileItem._file = reducedFile;
            });
        };

        otherImageUploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            // aggiorno dinamicamente l'url per l'upload
            item.url = '/api/v1/recipe/' + $scope.recipeToCreate.id + '/upload_image';
        };

        otherImageUploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.progress++;
        };

        otherImageUploader.onCompleteAll = function () {
            console.info("otherImageUploader - onCompleteAll");
        }

        //////////////////////////////////////////////

        /**
         * Osserva la variabile che indica il progresso del
         * caricamento di tutti i dati della ricetta.
         * Utile per eseguire dei calcoli a seguito del caricamento.
         */
        $scope.$watch("loadingProgress", function (newValue, oldValue) {

            if ($scope.editMode && $scope.loadingProgress >= Recipe.detailedRecipe.ingredientGroups.length) {// fine del caricamento della ricetta

                $scope.ingredient_groups = Recipe.detailedRecipe.ingredientGroups;

                // mapping dei nomi degli ingredienti
                for (var i in $scope.ingredient_groups) {
                    $scope.ingredient_groups[i].ingredients.map(function (ingredient) {
                        ingredient.name = ingredient.product.name.long;
                        return ingredient;
                    });
                }
                $scope.recipe_steps = Recipe.detailedRecipe.steps;

                // mi salvo pure la copia non modificata (utile per il confronto)
                $scope.originalRecipe = angular.copy(Recipe.detailedRecipe);
            }
        });

        $scope.openProgressModal = function () {
            /**
             * Creo un modale senza controller e gli passo lo scope attuale,
             * cosi all'interno della modale si avrà un binding a due vie
             */
            return $uibModal.open({
                animation: true,
                templateUrl: 'templates/recipe_progress_modal.html',
                scope: $scope,
                backdrop: 'static',// modal window is not closed when clicking outside of the modal window 
                size: 'md'
            });
        };

        // MODALE PER ESEGUIRE LA RICHIESTA DI AGGIUNTA DI UN INGREDIENTE

        $scope.openIngredientAddReqModal = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'templates/ingredient_req_modal.html',
                controller: function ($uibModalInstance, $scope) {
                    // passaggio paramteri
                    $scope.loading = false;
                    $scope.ingredient = {
                        name: "",
                        description: ""
                    };
                    $scope.finish = false;
                    // azioni possibili all'interno della modale
                    $scope.ok = function () {
                        if ($scope.finish) {
                            $uibModalInstance.dismiss('cancel');
                        } else {
                            $scope.loading = true

                            Ingredient.addIngredientReq(
                                $scope.ingredient.name,
                                $scope.ingredient.description,
                                function (response) {
                                    $scope.loading = false;
                                    $scope.finish = true;// sono pronto a uscire
                                    $uibModalInstance.close();
                                },
                                function (response) {
                                    // errore
                                    $scope.loading = false;
                                })
                        }
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                },
                size: 'md'
            });
        };

        // Registro il messaggio da mostrare prima del unload
        window.onbeforeunload = function (e) {
            return 'Perderai tutti i dati inseriti, sei sicuro che vuoi abbandonare?';
        };

        // Dopo il destroy del controller cancello anche il messaggio registrato
        $scope.$on('$destroy', function () {
            window.onbeforeunload = undefined;
        });

        var init = function () {
            // inizializzazione del controller

            /**
             * Se sono in modalità modifica devo caricare 
             * dei dati della ricetta da modificare.
             */
            if ($scope.editMode) {

                // aggiorno il riferimento alla ricetta da modificare
                $scope.recipeToCreate = Recipe.detailedRecipe;
                $scope.recipeToCreate.preselectedCategoryIdx = $scope.recipeCategories.indexOf($scope.recipeToCreate.category);

                // carico gli ingredienti per ogni gruppo
                for (var i in Recipe.detailedRecipe.ingredientGroups) {
                    var group = Recipe.detailedRecipe.ingredientGroups[i];
                    Ingredient.getIngredientGroupIngredients(group, function () {
                        $scope.loadingProgress++;
                    });
                }

                RecipeStep.getRecipeSteps(Recipe.detailedRecipe, 30, 0);

                // inizializzazione della posizione
                if ($scope.recipeToCreate.googlePlaceRef)// se questa c'è
                    ngGPlacesAPI.placeDetails({ reference: $scope.recipeToCreate.googlePlaceRef }).then(function (data) {

                        $scope.recipePlace = data.formatted_address;
                    });
            }
        };
        // and fire it after definition
        init();

    }]);
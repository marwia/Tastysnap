/**
 * assets/js/services/IngredientService.js
 * 
 * Servizio per gestire le operazioni con il server che riguardano
 * gli ingredienti e i gruppi di ingredienti.
 */
angular.module('IngredientService', [])
    .factory('Ingredient', ['$http', 'Auth', function($http, Auth) {

        var server_prefix = '/api/v1';

        // service body
        var o = {
            ingredients: [],
            unitsOfMeasure: [],
        };

        /**
         * Servizio per creare un gruppo di ingredienti per una data ricetta.
         */
        o.createIngredientGroup = function(recipe, ingredientGroup, successCallback) {
            return $http.post(
                server_prefix + '/recipe/' + recipe.id + '/ingredient_group',
                ingredientGroup,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(function(response) {

                    ingredientGroup.recipe = recipe.id;
                    ingredientGroup.id = response.data.id;
                    successCallback(ingredientGroup);

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per creare un gruppo di ingredienti per una data ricetta.
         */
        o.createIngredient = function(ingredient, ingredientGroup, successCallback) {
            return $http.post(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id + '/ingredient',
                ingredient,
                {
                    headers: {
                        Authorization: 'Bearer ' + Auth.getToken()
                    }
                })
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per caricare la lista delle unità di misura degli ingredienti
         */
        o.GetIngredientUnitOfMeasure = function() {
            return $http.get(
                server_prefix + '/ingredient/unit_of_measure')

                .then(function successCallback(response) {
                    console.info(response.data);
                    angular.copy(response.data.enum, o.unitsOfMeasure);

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per caricare la lista di ingredienti dato un gruppo.
         */
        o.getIngredientGroupIngredients = function(ingredientGroup) {
            return $http.get(
                server_prefix + '/ingredientgroup/' + ingredientGroup.id + '/ingredients')

                .then(function successCallback(response) {
                    ingredientGroup.ingredients = [];
                    console.info(response.data);
                    angular.copy(response.data, ingredientGroup.ingredients);

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Funzioni utili a fini dei calcoli dei valori nutrizionali 
         * di una ricetta.
         */

        /**
         * Funzione per ritrovare un nutrient per il suo codice.
         */
        o.findNutrient = function(nutrients, nutrient_code) {
            for (var i in nutrients) {
                if (nutrients[i].code.localeCompare(nutrient_code) == 0) {
                    return nutrients[i];
                }
            }
            return null;
        }

        o.findPortion = function(product, portion_unit) {
            for (var i in product.portions) {
                if (product.portions[i].code.localeCompare(portion_unit) == 0) {
                    return product.portions[i];
                }
            }
            return null;
        }

        /**
         * Parto con il presupposto che i valori nutrizionali sono su base 100g.
         * Il risultato della funzione sarebbe il fattore di scala per 
         * trasformare l'ingrediente nell'unità di misura del nutriente
         */
        o.scaleFactor = function(ingredient_unit_of_measure, nutrient_unit_of_measure) {
            // controllo se l'unità di misura dell'ingredient è un multiplo o sotto
            // multiplo di quella dell'ingrediente (il grammo)

            /**
             * Verifico che si parla di peso oppure kcal.
             * In pratica i valori nutrizionali sono sempre o espressi
             * in peso oppure in kcal. Quindi serve solo a stare sicuri.
             */
            if (nutrient_unit_of_measure.indexOf('g') > -1
                || nutrient_unit_of_measure.indexOf('kcal') > -1) {

                /**
                 * Verifico che anche l'ingrediente sia in peso
                 */
                if (ingredient_unit_of_measure.indexOf('g') > -1) {

                    if (nutrient_unit_of_measure.localeCompare('g') == 0) {
                        switch (ingredient_unit_of_measure) {
                            case 'kg':
                                return 1000;
                            case 'hg':
                                return 100;
                            case 'dg':
                                return 10;
                            case 'g':
                                return 1;
                            case 'mg':
                                return 0.1;
                        }
                    }

                    if (nutrient_unit_of_measure.localeCompare('mg') == 0) {
                        switch (ingredient_unit_of_measure) {
                            case 'kg':
                                return 10000;
                            case 'hg':
                                return 1000;
                            case 'dg':
                                return 100;
                            case 'g':
                                return 10;
                            case 'mg':
                                return 1;
                        }
                    }

                    if (nutrient_unit_of_measure.indexOf('µ') > -1) {
                        switch (ingredient_unit_of_measure) {
                            case 'kg':
                                return 100000;
                            case 'hg':
                                return 10000;
                            case 'dg':
                                return 1000;
                            case 'g':
                                return 100;
                            case 'mg':
                                return 10;
                        }
                    }

                }

                /**
                 * Se l'ingrediente è espresso in volume allora bisogna 
                 * adottare un metodo diverso. 
                 * In pratica, supponendo che ogni nutriente abbia tra le
                 * info anche il peso in porzioni e che vi sia quella per 
                 * un bicchiere ('cup'), possiamo convertire il suo volume
                 * in peso. Basta dividere il volume per l'ammontare di un
                 * bicchiere e poi moltiplicarlo per il valore in grammi 
                 * della porzione di un bicchiere.
                 * Es: 0.5l di latte = 0.5*1000/250 bicchieri, quindi
                 * 2 bicchieri * cupPortion.g è pari a circa 490g
                 */
                if (ingredient_unit_of_measure.indexOf('l') > -1) {

                    // converto il valore in ml è divido per un 'cup'
                    // 1 cup = 250ml
                    var x;
                    switch (ingredient_unit_of_measure) {
                        case 'l':
                            return 1000 / 250;
                        case 'dl':
                            return 100 / 250;
                        case 'cl':
                            return 10 / 250;
                        case 'ml':
                            return 1 / 250;
                    }
                    // a quesot punto il numero ottenuto è puro e basta 
                    // moltiplicarlo per il g della porzione del cup
                }
            }
        }

        o.getNutrientValue = function(ing_quantity, ing_unit, nutrient_unit, nutrient_val, product) {
            var scale_factor = o.scaleFactor(ing_unit, nutrient_unit)

            if (ing_unit.indexOf('l') > -1) {
                // ottengo la porzione di un bicchiere del prodotto
                var cupPortion = o.findPortion(product, 'cup');
                ing_quantity = ing_quantity * scale_factor * cupPortion.g;

                //aggiorno il scale factor di nuovo
                scale_factor = o.scaleFactor(ing_unit, nutrient_unit)
            }

            // ottengo il valore grezzo
            var x = ing_quantity * scale_factor * nutrient_val;
            // lo divido a secondo dell'unità
            if (nutrient_unit.localeCompare('mg') == 0) {
                x = x / 1000;
            }
            else if (nutrient_unit.localeCompare('g') == 0){
                x = x / 100;
            }
            else {
                x = x / 10000;//microgrammi
            }

            return { "val": x, "unit": nutrient_unit }

        }
        
        o.calculateNutrientTotal = function (ingredientGroups, nutrient_code) {
            var total = 0;
            
            for (var i in ingredientGroups) {
                var ingredientGroup = ingredientGroups[i];
                
                for (var k in ingredientGroup.ingredients) {
                    /**
                     * DA MIGLIORARE URGENTEMENTE
                     */
                    var ing = ingredientGroup.ingredients[k];
                    var nutrient = o.findNutrient(ing.product.nutrients, nutrient_code);
                    
                    total += o.getNutrientValue(ing.quantity, 
                    ing.unitOfMeasure, nutrient.units, nutrient.value, ing.product).val
                }
            }
            
            return total;
        }

        return o;
    }]);
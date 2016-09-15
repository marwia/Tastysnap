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
                ingredientGroup)
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
         * Servizio per aggiornare un ingrediente di un gruppo di una data ricetta.
         */
        o.updateIngredientGroup = function(ingredientGroup, successCallback) {
            return $http.put(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id,
                ingredientGroup)
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per eliminare un ingrediente da un gruppo di una data ricetta.
         */
        o.deleteIngredientGroup = function(ingredientGroup, successCallback) {
            return $http.delete(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id)
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per creare un gruppo di ingredienti per una data ricetta.
         */
        o.createIngredient = function(ingredientGroup, ingredient, successCallback) {
            return $http.post(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id + '/ingredient',
                ingredient)
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per aggiornare un ingrediente di un gruppo di una data ricetta.
         */
        o.updateIngredient = function(ingredientGroup, ingredient, successCallback) {
            console.info("updateIngredient", ingredient);
            return $http.put(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id + '/ingredient/' + ingredient.id,
                ingredient)
                .then(successCallback, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                });
        };

        /**
         * Servizio per eliminare un ingrediente da un gruppo di una data ricetta.
         */
        o.deleteIngredient = function(ingredientGroup, ingredient, successCallback) {
            return $http.delete(
                server_prefix + '/recipe/' + ingredientGroup.recipe + '/ingredient_group/' + ingredientGroup.id + '/ingredient/' + ingredient.id)
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
        o.getIngredientGroupIngredients = function(ingredientGroup, successCB, errorCB) {
            return $http.get(
                server_prefix + '/ingredientgroup/' + ingredientGroup.id + '/ingredients')
                .then(function successCallback(response) {
                    ingredientGroup.ingredients = [];
                    console.info(response.data);
                    angular.copy(response.data, ingredientGroup.ingredients);
                    
                    if (successCB)
                        successCB();

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //alert("Errore: " + response);
                    console.log(response);
                    
                    if (errorCB)
                        errorCB();
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

        /**
         * Funzione per trovare un particolare tipo di porzione
         * di un prodotto. Es.: 'cup'
         */
        o.findPortion = function(product, portion_unit) {
            for (var i in product.portions) {
                if (product.portions[i].unit.localeCompare(portion_unit) == 0) {
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

                    if (nutrient_unit_of_measure.localeCompare('g') == 0
                        || nutrient_unit_of_measure.localeCompare('kcal') == 0) {

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

        /**
         * Funzione che calcola il valore di un particolare nutriente
         * @param {Number} ing_quantity - quantità dell'ingrediente
         * @param {String} ing_unit - unità di misura dell'ingrediente
         * @param {String} nutrient_unit - unità di misura del prodotto
         * @param {String} nutrient_val - valore del nutriente su 100g di prodotto
         * @param {Object} product - L'oggetto che rappresenta il prodotto, 
         * serve nel caso di un ingrediente espresso in volume.
         * @return {Object} nutrient_val - Il valore del nutriente presente nell'ingrediente
         * espresso nell'unità di misura del nutriente.
         */
        o.getNutrientValue = function(ing_quantity, ing_unit, nutrient_unit, nutrient_val, product) {
            var scale_factor = o.scaleFactor(ing_unit, nutrient_unit)
            console.info(scale_factor);
            if (ing_unit.indexOf('l') > -1) {
                // ottengo la porzione di un bicchiere del prodotto
                console.info(product);
                var cupPortion = o.findPortion(product, 'cup');
                ing_quantity = ing_quantity * scale_factor * cupPortion.g;

                // aggiorno il scale factor di nuovo (sapendo che ormai 
                // il valore da liquidi è stato converito in peso, grammi per la precisione)
                scale_factor = o.scaleFactor('g', nutrient_unit)
            }

            // ottengo il valore grezzo
            var x = ing_quantity * scale_factor * nutrient_val;
            console.info(x);
            // lo divido a secondo dell'unità
            if (nutrient_unit.localeCompare('mg') == 0) {
                x = x / 1000;
            }
            else if (nutrient_unit.localeCompare('g') == 0) {
                x = x / 100;
            }
            else {
                x = x / 10000;//microgrammi
            }

            return { "value": x, "unit": nutrient_unit }

        }
        
        /**
         * Funzione che calcola il totale di un nutriente presente in tutti gli ingredienti
         * di tutti i gruppi.
         * @param {Array} ingredientGroups - Array di gruppi di ingredienti
         * @param {String} nutrient_code - Codice del nutriente
         * @return {Object} totale - Oggetto che rappresenta il totale di un nutriente
         * presente negli ingredienti di una ricetta e la sua unità di misura
         */
        o.calculateNutrientTotal = function(ingredientGroups, nutrient_code) {
            var total = 0;
            var unit = "";

            for (var i in ingredientGroups) {
                var ingredientGroup = ingredientGroups[i];

                for (var k in ingredientGroup.ingredients) {

                    var ing = ingredientGroup.ingredients[k];
                    var nutrient = o.findNutrient(ing.product.nutrients, nutrient_code);
                    
                    if (nutrient) {
                        var nutrient_value = o.getNutrientValue(ing.quantity,
                            ing.unitOfMeasure, nutrient.units, nutrient.value, ing.product);
                        
                        total += nutrient_value.value;
                        unit = nutrient_value.unit;
                    }
                }
            }

            return { "value": total, "unit": unit };
        }

        return o;
    }]);
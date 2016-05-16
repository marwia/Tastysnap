/**
 * MyUtils
 *
 * @description :: Insieme di funzioni utili
 * @help        :: See http://links.sailsjs.org/docs/services
 */

module.exports = {

    /**
     * Funzione di supporto all'ordinamento di array.
     * 
     * @param {String} property - nome della proprietà dell'oggetto
     * in base a cui eseguire l'ordinamento (es.: 'title DESC')
     * @param {Function} whenDone - callback finale
     * 
     * NOTE: La funzione va usata in questo modo:
     * objects.sort(dynamicSort('title ASC'));
     */
    dynamicSort: function (property) {
        var sortOrder = 1;
        // tolgo eventuali spazi...
        var property = property.split(" ").join("");

        if (property.indexOf('DESC') > -1) {
            sortOrder = -1;
            property = property.split('DESC')[0];
        } else {
            property = property.split('ASC')[0];
        }

        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    },

    /**
     * Funzione di supporto al filtraggio di un array.
     * In particolare, tale funzione serve a verificare serve
     * un dato array è incluso nell'altro.
     * 
     * @param {Array} sup - array 
     * @param {Array} sub - array che si sta verificando
     * 
     * http://stackoverflow.com/questions/8628059/check-if-every-element-in-one-array-is-in-a-second-array
     */
    superBag: function (sup, sub) {
        sup.sort();
        sub.sort();
        var i, j;
        for (i = 0, j = 0; i < sup.length && j < sub.length;) {
            if (sup[i] < sub[j]) {
                ++i;
            } else if (sup[i] == sub[j]) {
                ++i; ++j;
            } else {
                // sub[j] not in sup, so sub not subbag
                return false;
            }
        }
        // make sure there are no elements left in sub
        return j == sub.length;
    }

};
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
    dynamicSort: function(property) {
        var sortOrder = 1;
        // tolgo eventuali spazi...
        var property = property.split(" ").join("");

        if (property.indexOf('DESC') > -1) {
            sortOrder = -1;
            property = property.split('DESC')[0];
        } else {
            property = property.split('ASC')[0];
        }

        return function(a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    
};
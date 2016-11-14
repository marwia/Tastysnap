/**
 * MyUtils
 *
 * @description :: Insieme di funzioni utili
 * @help        :: See http://links.sailsjs.org/docs/services
 */

var http = require('http');

module.exports = {

    /**
     * Funzione per ritrovare l'ip del client che
     * sta parlando col server.
     * Link: http://stackoverflow.com/a/19524949/5068914
     */
    isValidInvitation: function (invitation) {
        var fs = require('fs');
        var list = JSON.parse(fs.readFileSync('invitation_list.json', 'utf8'));


        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i]['list'].length; j++) {
                if (list[i]['list'][j] == invitation) {
                    // elimino l'invito usato appena
                    delete list[i]['list'][j];
                    // salvo il file
                    console.log("salvo il file");
                    fs.writeFile('invitation_list.json', JSON.stringify(list, null, 4), function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("JSON saved...");
                        }
                    });
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Funzione per ritrovare l'ip del client che
     * sta parlando col server.
     * Link: http://stackoverflow.com/a/19524949/5068914
     */
    getClientIp: function (req) {
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        return ip;
    },

    /**
     * Funzione per ritrovare le informazioni sulla posizione
     * da un indirizzo IP. Questo processo viene chiamato 
     * "geolookup". 
     * In alternativa si potrebbe usare questo modulo ma 
     * richiede grandi quantità di memoria RAM e non supporta
     * chiaramente le micro-istanze di AWS: 
     * https://github.com/bluesmoon/node-geoip
     */
    getIpGeoLookup: function (ip, successCallback, errorCallback) {

        var options = {
            host: 'freegeoip.net',
            port: 80,
            path: '/json/' + ip
        };

        http.get(options, function (res) {
            console.log("freeGeoIp response: " + res.statusCode);

            var body = '';

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var jsonBody = JSON.parse(body);

                if (res.statusCode == 200)
                    successCallback(jsonBody);
                else {
                    if (typeof errorCallback === 'function')
                        errorCallback();
                }
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
        });
    },

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
var fs = require('fs');

/**
 * Configurazione dei vari certificati SSL
 */
module.exports = {

    ssl : {
         ca: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/chain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/privkey.pem'),
       cert: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/cert.pem')
    },
    
    port: process.env.PORT || 443

};
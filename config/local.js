var fs = require('fs');

/**
 * Configurazione dei vari certificati SSL
 */
<<<<<<< HEAD

/*
module.exports = {

    ssl : {
         ca: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/chain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/privkey.pem'),
       cert: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/cert.pem')
    },
=======
if (process.env.NODE_ENV === 'production') {
>>>>>>> 4d0b2e27ce6ab2e978a36fd3582ebddc580bd391
    
    module.exports = {

        ssl: {
            ca: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/chain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/tastysnap.com/cert.pem')
        },

        port: process.env.PORT || 443

<<<<<<< HEAD
};
*/
=======
    };
}
>>>>>>> 4d0b2e27ce6ab2e978a36fd3582ebddc580bd391

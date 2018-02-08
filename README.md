# TastySnap Core

Questo progetto è stato creato usando:

* il framework [Sails](http://sailsjs.org) per il lato server;
* il framework AngularJS per il lato client.

## AWS Setup
1. Creare un account personale;
2. Lanciare un’istanza di EC2 Linux Ubuntu e scaricare la chiave privata (.pem);
3. Seguire la guida “AWS EC2 Sails setup” sulla wiki WebAppDevelopment;
4. Associare un elastic ip all’istanza appena creata;
5. Aprire la porta HTTP e HTTPS tramite la risposta su StackOverflow https://stackoverflow.com/a/10454688/5068914
6. Installare NGINX web server tramite la guida https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
7. Configurare NGINX per fare il redirect delle chiamate HTTP a HTTPS, quindi aggiungere alla fine del primo blocco:
	```
		##
        # Tastysnap HTTPS redirect
        ##

        server {
                server_name tastysnap.com www.tastysnap.com;
                return 301 https://$host$request_uri;
        }
	```
8. Installare Redis tramite la guida https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04
9. Creare un bucket S3;
10. Creare una distribuzione di tipo Web (Cloudfront) aggiungendo come CNAMES `www.cdn.tastysnap.com cdn.tastysnap.com`
11. Ottenere le credenziali per il bucket tramite la guida https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html
12. Aggiungiamo i permessi di lettura a tutti tramite la guida sulla wiki WebAppDevelopment 
13. Installare certbot plugin per generare certificati SSL, seguire questa guida https://certbot.eff.org/#ubuntuxenial-other
14. Modifico le impostazione del DNS di Aruba, agisco sul Record A e cambio IP ai campi `vuoto` e `www`
15. Avviare la procedura per ottenere i certificati SSL, usare l’approccio “standalone” (spegnendo NGINX o altri web server)
16. Aggiunto un crontab con il comando `sudo crontab -e` per rinnovare il certificato almeno due volte al giorno: `15 3,18 * * * certbot renew --post-hook "systemctl reload nginx"`
17. Popolare il database con gli ingredienti tradotti usando lo script in Python (nutrient-db-tastysnap-master)
18. Aggiunto un crontab con il comando `sudo crontab -e` per avviare tastysnap al boot grazie a crontab: `@reboot sudo forever start /home/ubuntu/tastysnap_core/app.js --prod`





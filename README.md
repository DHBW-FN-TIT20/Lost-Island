# Lost-Island

Lost-Island ist eine mit [three.js](https://threejs.org) erstellte Insel zum Erkunden und herumlaufen. Dies war ein Projekt für die DHBW Ravensburg am Campus Friedrichsahfen für die Vorlesung Computergrafik. 

# Starten den Anwendung

Zum starten der Anwendung benötig man nur einen statischen Server wie zum Beispiel [Apache](https://www.apache.org). Alle benötigten Dateien sind vorhanden und es ist keine Internetverbindung nötig.

## Docker
Alternativ kann man zum starten der Anwendung auch einen Docker-Container Starten: 

```bash
# Direkt mit Docker und httpd
docker run --name my-apache-app -p 8080:80 -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4

# Mithilfe Docker-Compose und Dockerfile (Port 80)
docker-compose up -d 
```

# JSDOC
Eine Dokumetation ist hier zu finden: https://dhbw-fn-tit20.github.io/Lost-Island/

# Contributors
- [David, Felder](https://github.com/screetox)
- [Glaser, Florian](https://github.com/screetox)
- [Herkommer, Florian](https://github.com/Floqueboque)
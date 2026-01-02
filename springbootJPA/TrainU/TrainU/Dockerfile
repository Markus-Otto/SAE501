# 1. On part d'une version légère de Java 17
FROM eclipse-temurin:17-jre-alpine

# 2. On crée un dossier de travail
WORKDIR /app

# 3. On copie le fichier .jar généré (assure-toi d'avoir fait 'mvn package' avant)
# Remplace "TrainU-0.0.1-SNAPSHOT.jar" par le vrai nom dans ton dossier target
COPY target/*.jar app.jar

# 4. On dit à Docker que l'app écoute sur le port 8080
EXPOSE 8080

# 5. La commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]

ENTRYPOINT ["top", "-b"]
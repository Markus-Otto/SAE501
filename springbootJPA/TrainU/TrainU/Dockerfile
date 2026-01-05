# ===== BUILD =====
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# ===== RUN =====
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /build/target/TrainU-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

COPY --from=build /app/target/server-0.0.1-SNAPSHOT.jar /app/app.jar

ENV DB_URL=jdbc:postgresql://postgres:5432/dev_ops \
    DB_USER=devops \
    DB_PASSWORD=devops \
    JWT_SECRET=change_this_secret_to_a_long_random_string_32_chars_min \
    JWT_EXPIRATION_MS=86400000 \
    SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

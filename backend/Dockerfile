# ── Build ────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Fetch dependencies first (cached layer)
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew && ./gradlew dependencies --no-daemon

# Build
COPY src src
RUN ./gradlew bootJar --no-daemon -x test

# ── Production ───────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime
RUN addgroup -S portfolio && adduser -S portfolio -G portfolio
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
RUN chown portfolio:portfolio app.jar
USER portfolio
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]

# ── Development (hot reload via Spring DevTools) ─────────────────
FROM build AS development
EXPOSE 8080
ENTRYPOINT ["./gradlew", "bootRun", "--no-daemon"]

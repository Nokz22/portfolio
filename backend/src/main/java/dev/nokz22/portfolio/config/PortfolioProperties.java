package dev.nokz22.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import java.util.List;

@ConfigurationProperties(prefix = "portfolio")
public record PortfolioProperties(
        GithubProperties github,
        ContactProperties contact,
        CorsProperties cors
) {

    public record GithubProperties(
            String username,
            String token,
            List<String> pinnedRepos
    ) {}

    public record ContactProperties(
            String recipientEmail,
            int rateLimitPerHour
    ) {}

    public record CorsProperties(
            List<String> allowedOrigins
    ) {}
}

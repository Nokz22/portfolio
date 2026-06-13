package dev.nokz22.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class GithubClientConfig {

    private static final String GITHUB_API_BASE = "https://api.github.com";
    private static final String ACCEPT_HEADER = "application/vnd.github.v3+json";
    private static final String API_VERSION_HEADER = "2022-11-28";

    @Bean
    public RestClient githubRestClient(PortfolioProperties portfolioProperties) {
        RestClient.Builder builder = RestClient.builder()
                .baseUrl(GITHUB_API_BASE)
                .defaultHeader("Accept", ACCEPT_HEADER)
                .defaultHeader("X-GitHub-Api-Version", API_VERSION_HEADER);

        String token = portfolioProperties.github().token();
        if (token != null && !token.isBlank()) {
            builder.defaultHeader("Authorization", "Bearer " + token);
        }

        return builder.build();
    }
}

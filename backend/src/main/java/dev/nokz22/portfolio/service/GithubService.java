package dev.nokz22.portfolio.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import dev.nokz22.portfolio.config.PortfolioProperties;
import dev.nokz22.portfolio.dto.response.GithubRepoDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class GithubService {

    private final RestClient restClient;
    private final PortfolioProperties portfolioProperties;

    public GithubService(RestClient githubRestClient, PortfolioProperties portfolioProperties) {
        this.restClient = githubRestClient;
        this.portfolioProperties = portfolioProperties;
    }

    @Cacheable("github-repos")
    public List<GithubRepoDto> getFeaturedRepos() {
        String username = portfolioProperties.github().username();
        List<String> pinnedRepos = portfolioProperties.github().pinnedRepos();

        return pinnedRepos.stream()
                .map(repoName -> fetchRepo(username, repoName))
                .filter(Objects::nonNull)
                .toList();
    }

    private GithubRepoDto fetchRepo(String username, String repoName) {
        try {
            GithubApiRepo apiRepo = restClient.get()
                    .uri("/repos/{owner}/{repo}", username, repoName)
                    .retrieve()
                    .body(GithubApiRepo.class);

            if (apiRepo == null) {
                log.warn("GitHub API returned null for repo {}/{}", username, repoName);
                return null;
            }

            return toDto(apiRepo);
        } catch (Exception ex) {
            log.warn("Failed to fetch GitHub repo {}/{}: {}", username, repoName, ex.getMessage());
            return null;
        }
    }

    private GithubRepoDto toDto(GithubApiRepo apiRepo) {
        return new GithubRepoDto(
                apiRepo.id(),
                apiRepo.name(),
                apiRepo.fullName(),
                apiRepo.description(),
                apiRepo.htmlUrl(),
                apiRepo.stargazersCount(),
                apiRepo.forksCount(),
                apiRepo.language(),
                apiRepo.topics() != null ? apiRepo.topics() : List.of(),
                apiRepo.updatedAt()
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GithubApiRepo(
            long id,
            String name,
            @JsonProperty("full_name") String fullName,
            String description,
            @JsonProperty("html_url") String htmlUrl,
            @JsonProperty("stargazers_count") int stargazersCount,
            @JsonProperty("forks_count") int forksCount,
            String language,
            List<String> topics,
            @JsonProperty("updated_at") String updatedAt
    ) {}
}

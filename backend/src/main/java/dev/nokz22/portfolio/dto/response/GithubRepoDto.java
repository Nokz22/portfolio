package dev.nokz22.portfolio.dto.response;

import java.util.List;

public record GithubRepoDto(
        long id,
        String name,
        String fullName,
        String description,
        String url,
        int stars,
        int forks,
        String language,
        List<String> topics,
        String updatedAt
) {}

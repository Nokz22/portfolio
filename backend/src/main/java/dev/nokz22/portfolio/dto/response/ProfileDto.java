package dev.nokz22.portfolio.dto.response;

public record ProfileDto(
        String name,
        String title,
        String location,
        String email,
        String github,
        String linkedin,
        String cvUrl,
        String summary
) {}

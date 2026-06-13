package dev.nokz22.portfolio.dto.response;

import java.util.List;

public record ExperienceDto(
        int id,
        String type,
        String company,
        String role,
        String startDate,
        String endDate,
        boolean current,
        String location,
        String description,
        List<String> technologies
) {}

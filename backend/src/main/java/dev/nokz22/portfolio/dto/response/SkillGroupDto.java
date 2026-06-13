package dev.nokz22.portfolio.dto.response;

import java.util.List;

public record SkillGroupDto(
        String domain,
        List<SkillDto> skills
) {}

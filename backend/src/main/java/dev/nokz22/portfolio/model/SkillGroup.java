package dev.nokz22.portfolio.model;

import java.util.List;

public record SkillGroup(
        String domain,
        List<SkillItem> skills
) {}

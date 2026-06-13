package dev.nokz22.portfolio.model;

import java.util.List;
import java.util.Map;

public record Experience(
        int id,
        String type,
        String company,
        String role,
        String startDate,
        String endDate,
        boolean current,
        String location,
        Map<String, String> description,
        List<String> technologies
) {}

package dev.nokz22.portfolio.model;

import java.util.Map;

public record Profile(
        String name,
        String title,
        String location,
        String email,
        String phone,
        String github,
        String linkedin,
        String cvUrl,
        Map<String, String> summary
) {}

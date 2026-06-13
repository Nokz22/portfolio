package dev.nokz22.portfolio.controller;

import dev.nokz22.portfolio.dto.response.ExperienceDto;
import dev.nokz22.portfolio.dto.response.ProfileDto;
import dev.nokz22.portfolio.dto.response.SkillGroupDto;
import dev.nokz22.portfolio.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile(
            @RequestParam(defaultValue = "pt") String lang) {
        return ResponseEntity.ok(contentService.getProfile(lang));
    }

    @GetMapping("/experience")
    public ResponseEntity<List<ExperienceDto>> getExperience(
            @RequestParam(defaultValue = "pt") String lang) {
        return ResponseEntity.ok(contentService.getExperience(lang));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillGroupDto>> getSkills() {
        return ResponseEntity.ok(contentService.getSkills());
    }
}

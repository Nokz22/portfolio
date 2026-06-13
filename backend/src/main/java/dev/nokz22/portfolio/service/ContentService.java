package dev.nokz22.portfolio.service;

import dev.nokz22.portfolio.dto.response.ExperienceDto;
import dev.nokz22.portfolio.dto.response.ProfileDto;
import dev.nokz22.portfolio.dto.response.SkillDto;
import dev.nokz22.portfolio.dto.response.SkillGroupDto;
import dev.nokz22.portfolio.model.Experience;
import dev.nokz22.portfolio.model.Profile;
import dev.nokz22.portfolio.model.SkillGroup;
import dev.nokz22.portfolio.model.SkillItem;
import dev.nokz22.portfolio.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ContentService {

    private static final String FALLBACK_LANG = "pt";

    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public ProfileDto getProfile(String lang) {
        Profile profile = contentRepository.findProfile();
        String summary = selectLocalized(profile.summary(), lang);
        return new ProfileDto(
                profile.name(),
                profile.title(),
                profile.location(),
                profile.email(),
                profile.github(),
                profile.linkedin(),
                profile.cvUrl(),
                summary
        );
    }

    public List<ExperienceDto> getExperience(String lang) {
        List<Experience> experiences = contentRepository.findAllExperience();
        return experiences.stream()
                .map(exp -> toExperienceDto(exp, lang))
                .toList();
    }

    public List<SkillGroupDto> getSkills() {
        List<SkillGroup> skillGroups = contentRepository.findAllSkillGroups();
        return skillGroups.stream()
                .map(this::toSkillGroupDto)
                .toList();
    }

    private ExperienceDto toExperienceDto(Experience experience, String lang) {
        String description = selectLocalized(experience.description(), lang);
        return new ExperienceDto(
                experience.id(),
                experience.type(),
                experience.company(),
                experience.role(),
                experience.startDate(),
                experience.endDate(),
                experience.current(),
                experience.location(),
                description,
                experience.technologies()
        );
    }

    private SkillGroupDto toSkillGroupDto(SkillGroup skillGroup) {
        List<SkillDto> skillDtos = skillGroup.skills().stream()
                .map(this::toSkillDto)
                .toList();
        return new SkillGroupDto(skillGroup.domain(), skillDtos);
    }

    private SkillDto toSkillDto(SkillItem skillItem) {
        return new SkillDto(skillItem.name(), skillItem.level());
    }

    private String selectLocalized(Map<String, String> translations, String lang) {
        if (translations == null) {
            return null;
        }
        String value = translations.get(lang);
        if (value != null) {
            return value;
        }
        return translations.get(FALLBACK_LANG);
    }
}

package dev.nokz22.portfolio.repository.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.nokz22.portfolio.exception.ContentLoadException;
import dev.nokz22.portfolio.model.Experience;
import dev.nokz22.portfolio.model.Profile;
import dev.nokz22.portfolio.model.SkillGroup;
import dev.nokz22.portfolio.repository.ContentRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Repository
public class JsonContentRepository implements ContentRepository {

    private static final String PROFILE_PATH = "content/profile.json";
    private static final String EXPERIENCE_PATH = "content/experience.json";
    private static final String SKILLS_PATH = "content/skills.json";

    private final Profile profile;
    private final List<Experience> experiences;
    private final List<SkillGroup> skillGroups;

    public JsonContentRepository(ObjectMapper objectMapper) {
        try {
            this.profile = loadResource(objectMapper, PROFILE_PATH, new TypeReference<Profile>() {});
            this.experiences = loadResource(objectMapper, EXPERIENCE_PATH, new TypeReference<List<Experience>>() {});
            this.skillGroups = loadResource(objectMapper, SKILLS_PATH, new TypeReference<List<SkillGroup>>() {});
        } catch (IOException ex) {
            throw new ContentLoadException("Failed to load content from classpath resources", ex);
        }
    }

    private <T> T loadResource(ObjectMapper objectMapper, String path, TypeReference<T> typeRef) throws IOException {
        ClassPathResource resource = new ClassPathResource(path);
        try (InputStream inputStream = resource.getInputStream()) {
            return objectMapper.readValue(inputStream, typeRef);
        }
    }

    @Override
    public Profile findProfile() {
        return profile;
    }

    @Override
    public List<Experience> findAllExperience() {
        return List.copyOf(experiences);
    }

    @Override
    public List<SkillGroup> findAllSkillGroups() {
        return List.copyOf(skillGroups);
    }
}

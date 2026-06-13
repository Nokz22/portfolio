package dev.nokz22.portfolio.service;

import dev.nokz22.portfolio.dto.response.ExperienceDto;
import dev.nokz22.portfolio.dto.response.ProfileDto;
import dev.nokz22.portfolio.model.Experience;
import dev.nokz22.portfolio.model.Profile;
import dev.nokz22.portfolio.model.SkillGroup;
import dev.nokz22.portfolio.repository.ContentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContentServiceTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentService contentService;

    private Profile buildProfile() {
        return new Profile(
                "Nuno Ferreira",
                "Junior Software Developer",
                "Porto, Portugal",
                "test@example.com",
                "+351 900 000 000",
                "https://github.com/Nokz22",
                "https://linkedin.com/in/test",
                "/cv.pdf",
                Map.of("pt", "Resumo em português", "en", "Summary in English")
        );
    }

    private Experience buildExperience(boolean current) {
        return new Experience(
                1,
                "work",
                "Paiva Digital",
                "WordPress Developer",
                "2026-01",
                null,
                current,
                "Porto, Portugal",
                Map.of("pt", "Descrição em português", "en", "Description in English"),
                List.of("WordPress", "WooCommerce")
        );
    }

    @Test
    void getProfile_returnsPtSummaryByDefault() {
        when(contentRepository.findProfile()).thenReturn(buildProfile());

        ProfileDto result = contentService.getProfile("pt");

        assertThat(result.summary()).isEqualTo("Resumo em português");
    }

    @Test
    void getProfile_returnsEnSummaryWhenRequested() {
        when(contentRepository.findProfile()).thenReturn(buildProfile());

        ProfileDto result = contentService.getProfile("en");

        assertThat(result.summary()).isEqualTo("Summary in English");
    }

    @Test
    void getProfile_fallsBackToPtForUnknownLang() {
        when(contentRepository.findProfile()).thenReturn(buildProfile());

        ProfileDto result = contentService.getProfile("fr");

        assertThat(result.summary()).isEqualTo("Resumo em português");
    }

    @Test
    void getExperience_mapsCurrentJobCorrectly() {
        when(contentRepository.findAllExperience()).thenReturn(List.of(buildExperience(true)));

        List<ExperienceDto> result = contentService.getExperience("en");

        assertThat(result).hasSize(1);
        ExperienceDto dto = result.get(0);
        assertThat(dto.current()).isTrue();
        assertThat(dto.endDate()).isNull();
        assertThat(dto.company()).isEqualTo("Paiva Digital");
        assertThat(dto.description()).isEqualTo("Description in English");
    }
}

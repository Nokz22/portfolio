package dev.nokz22.portfolio.controller;

import dev.nokz22.portfolio.dto.response.ExperienceDto;
import dev.nokz22.portfolio.dto.response.ProfileDto;
import dev.nokz22.portfolio.dto.response.SkillDto;
import dev.nokz22.portfolio.dto.response.SkillGroupDto;
import dev.nokz22.portfolio.service.ContentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        value = ContentController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
class ContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContentService contentService;

    @Test
    void getProfile_returns200WithProfileData() throws Exception {
        ProfileDto profile = new ProfileDto(
                "Nuno Ferreira",
                "Junior Software Developer",
                "Porto, Portugal",
                "test@example.com",
                "https://github.com/Nokz22",
                "https://linkedin.com/in/test",
                "/cv.pdf",
                "Resumo em português"
        );
        when(contentService.getProfile(anyString())).thenReturn(profile);

        mockMvc.perform(get("/api/v1/profile")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuno Ferreira"))
                .andExpect(jsonPath("$.title").value("Junior Software Developer"))
                .andExpect(jsonPath("$.summary").value("Resumo em português"));
    }

    @Test
    void getExperience_returns200WithExperienceList() throws Exception {
        ExperienceDto exp = new ExperienceDto(
                1, "work", "Paiva Digital", "WordPress Developer",
                "2026-01", null, true, "Porto, Portugal",
                "Descrição em português", List.of("WordPress")
        );
        when(contentService.getExperience(anyString())).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/v1/experience")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].company").value("Paiva Digital"))
                .andExpect(jsonPath("$[0].current").value(true));
    }

    @Test
    void getSkills_returns200WithSkillGroups() throws Exception {
        SkillGroupDto group = new SkillGroupDto(
                "Linguagens & Web",
                List.of(new SkillDto("Java", "advanced"))
        );
        when(contentService.getSkills()).thenReturn(List.of(group));

        mockMvc.perform(get("/api/v1/skills")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].domain").value("Linguagens & Web"))
                .andExpect(jsonPath("$[0].skills[0].name").value("Java"));
    }
}

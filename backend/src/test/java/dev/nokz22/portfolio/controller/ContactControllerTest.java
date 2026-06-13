package dev.nokz22.portfolio.controller;

import dev.nokz22.portfolio.config.RateLimiter;
import dev.nokz22.portfolio.service.ContactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
        value = ContactController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactService contactService;

    @MockBean
    private RateLimiter rateLimiter;

    @Test
    void sendMessage_withValidData_returns200() throws Exception {
        when(rateLimiter.tryConsume(anyString())).thenReturn(true);

        String body = """
                {
                    "name": "Test User",
                    "email": "test@example.com",
                    "message": "This is a test message that is long enough"
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(contactService).sendMessage(any());
    }

    @Test
    void sendMessage_withInvalidEmail_returns422() throws Exception {
        String body = """
                {
                    "name": "Test User",
                    "email": "not-an-email",
                    "message": "This is a test message that is long enough"
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnprocessableEntity());

        verify(contactService, never()).sendMessage(any());
    }

    @Test
    void sendMessage_withHoneypotFilled_returns200Silently() throws Exception {
        String body = """
                {
                    "name": "Bot",
                    "email": "bot@example.com",
                    "message": "This is a bot message that is long enough",
                    "honeypot": "I am a bot"
                }
                """;

        mockMvc.perform(post("/api/v1/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());

        verify(contactService, never()).sendMessage(any());
        verify(rateLimiter, never()).tryConsume(anyString());
    }
}

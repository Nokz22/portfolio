package dev.nokz22.portfolio.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ResendService {

    private static final String RESEND_URL = "https://api.resend.com/emails";

    private final String apiKey;

    public ResendService(@Value("${resend.api-key:}") String apiKey) {
        this.apiKey = apiKey;
    }

    public void sendEmail(String to, String replyTo, String subject, String text) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("RESEND_API_KEY not set — skipping email send");
            return;
        }

        RestClient client = RestClient.builder()
                .baseUrl(RESEND_URL)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> body = Map.of(
                "from", "Portfolio <onboarding@resend.dev>",
                "to", List.of(to),
                "reply_to", replyTo,
                "subject", subject,
                "text", text
        );

        client.post()
                .body(body)
                .retrieve()
                .toBodilessEntity();

        log.info("Email sent via Resend to {}", to);
    }
}

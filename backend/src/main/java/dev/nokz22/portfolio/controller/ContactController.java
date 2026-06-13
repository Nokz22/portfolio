package dev.nokz22.portfolio.controller;

import dev.nokz22.portfolio.config.RateLimiter;
import dev.nokz22.portfolio.dto.request.ContactRequestDto;
import dev.nokz22.portfolio.exception.RateLimitException;
import dev.nokz22.portfolio.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class ContactController {

    private static final String FORWARDED_FOR_HEADER = "X-Forwarded-For";

    private final ContactService contactService;
    private final RateLimiter rateLimiter;

    public ContactController(ContactService contactService, RateLimiter rateLimiter) {
        this.contactService = contactService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> sendMessage(
            @Valid @RequestBody ContactRequestDto request,
            HttpServletRequest httpRequest) {

        if (request.honeypot() != null && !request.honeypot().isBlank()) {
            return ResponseEntity.ok().build();
        }

        String clientIp = resolveClientIp(httpRequest);

        if (!rateLimiter.tryConsume(clientIp)) {
            throw new RateLimitException("Rate limit exceeded. Please try again later.");
        }

        contactService.sendMessage(request);
        return ResponseEntity.ok().build();
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader(FORWARDED_FOR_HEADER);
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

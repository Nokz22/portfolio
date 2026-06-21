package dev.nokz22.portfolio.service;

import dev.nokz22.portfolio.config.PortfolioProperties;
import dev.nokz22.portfolio.dto.request.ContactRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ContactService {

    private static final String SUBJECT_PREFIX = "[Portfolio] Mensagem de ";

    private final ResendService resendService;
    private final String recipientEmail;

    public ContactService(ResendService resendService, PortfolioProperties portfolioProperties) {
        this.resendService = resendService;
        this.recipientEmail = portfolioProperties.contact().recipientEmail();
    }

    public void sendMessage(ContactRequestDto request) {
        log.info("Sending contact message from {} <{}>", request.name(), request.email());
        resendService.sendEmail(
                recipientEmail,
                request.email(),
                SUBJECT_PREFIX + request.name(),
                buildBody(request)
        );
    }

    private String buildBody(ContactRequestDto request) {
        return "Nome: " + request.name() + "\n"
                + "Email: " + request.email() + "\n\n"
                + request.message();
    }
}

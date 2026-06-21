package dev.nokz22.portfolio.service;

import dev.nokz22.portfolio.config.PortfolioProperties;
import dev.nokz22.portfolio.dto.request.ContactRequestDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ContactService {

    private static final String SUBJECT_PREFIX = "[Portfolio] Mensagem de ";

    private final JavaMailSender mailSender;
    private final String recipientEmail;
    private final String senderEmail;

    public ContactService(JavaMailSender mailSender, PortfolioProperties portfolioProperties,
                          @Value("${spring.mail.username}") String senderEmail) {
        this.mailSender = mailSender;
        this.recipientEmail = portfolioProperties.contact().recipientEmail();
        this.senderEmail = senderEmail;
    }

    public void sendMessage(ContactRequestDto request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setTo(recipientEmail);
        message.setReplyTo(request.email());
        message.setSubject(SUBJECT_PREFIX + request.name());
        message.setText(buildBody(request));

        log.info("Sending contact message from {} <{}>", request.name(), request.email());
        mailSender.send(message);
    }

    private String buildBody(ContactRequestDto request) {
        return "Nome: " + request.name() + "\n"
                + "Email: " + request.email() + "\n\n"
                + request.message();
    }
}

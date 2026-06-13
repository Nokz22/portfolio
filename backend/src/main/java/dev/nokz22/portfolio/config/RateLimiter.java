package dev.nokz22.portfolio.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiter {

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final int rateLimitPerHour;

    public RateLimiter(PortfolioProperties portfolioProperties) {
        this.rateLimitPerHour = portfolioProperties.contact().rateLimitPerHour();
    }

    public boolean tryConsume(String ip) {
        Bucket bucket = buckets.computeIfAbsent(ip, this::newBucket);
        return bucket.tryConsume(1);
    }

    private Bucket newBucket(String ip) {
        Bandwidth limit = Bandwidth.builder()
                .capacity(rateLimitPerHour)
                .refillIntervally(rateLimitPerHour, Duration.ofHours(1))
                .build();
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}

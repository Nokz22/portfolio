package dev.nokz22.portfolio.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    public static final String GITHUB_REPOS_CACHE = "github-repos";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCache githubReposCache = new CaffeineCache(
                GITHUB_REPOS_CACHE,
                Caffeine.newBuilder()
                        .maximumSize(50)
                        .expireAfterWrite(15, TimeUnit.MINUTES)
                        .build()
        );

        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(List.of(githubReposCache));
        return cacheManager;
    }
}

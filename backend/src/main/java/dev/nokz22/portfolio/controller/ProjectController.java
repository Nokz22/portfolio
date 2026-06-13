package dev.nokz22.portfolio.controller;

import dev.nokz22.portfolio.dto.response.GithubRepoDto;
import dev.nokz22.portfolio.service.GithubService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class ProjectController {

    private final GithubService githubService;

    public ProjectController(GithubService githubService) {
        this.githubService = githubService;
    }

    @GetMapping("/projects/featured")
    public ResponseEntity<List<GithubRepoDto>> getFeaturedProjects() {
        return ResponseEntity.ok(githubService.getFeaturedRepos());
    }
}

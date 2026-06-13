package dev.nokz22.portfolio.repository;

import dev.nokz22.portfolio.model.Experience;
import dev.nokz22.portfolio.model.Profile;
import dev.nokz22.portfolio.model.SkillGroup;

import java.util.List;

public interface ContentRepository {

    Profile findProfile();

    List<Experience> findAllExperience();

    List<SkillGroup> findAllSkillGroups();
}

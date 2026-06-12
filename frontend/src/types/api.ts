// DTO types mirroring backend /dto/response/*.java
// Keep in sync with backend changes — these are the contracts.

export interface ProfileDto {
  name: string
  title: string
  location: string
  email: string
  github: string
  linkedin: string
  summary: string
  cvUrl: string
}

export interface ExperienceDto {
  id: number
  company: string
  role: string
  startDate: string   // ISO "YYYY-MM"
  endDate: string | null
  current: boolean
  location: string
  description: string
  technologies: string[]
}

export interface SkillDto {
  name: string
  level: 'expert' | 'advanced' | 'intermediate' | 'learning'
}

export interface SkillGroupDto {
  domain: string
  skills: SkillDto[]
}

export interface GithubRepoDto {
  id: number
  name: string
  fullName: string
  description: string | null
  url: string
  stars: number
  forks: number
  language: string | null
  topics: string[]
  updatedAt: string
}

// RFC 7807 Problem Details — matches backend GlobalExceptionHandler shape
export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail: string
  instance: string
}

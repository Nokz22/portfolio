import type { ProfileDto, ExperienceDto, SkillGroupDto, GithubRepoDto } from '@/types/api'

export const STATIC_PROFILE: Record<'pt' | 'en', ProfileDto> = {
  pt: {
    name: 'Nuno Ferreira',
    title: 'Junior Software Developer',
    location: 'Porto, Portugal',
    email: 'nunopferreira01@gmail.com',
    github: 'https://github.com/Nokz22',
    linkedin: 'https://www.linkedin.com/in/nuno-ferreira-a02552203/',
    cvUrl: '/cv-nuno-ferreira.pdf',
    summary:
      'Tecnologia e programação fascinaram-me desde sempre, mas o meu percurso não foi linear — e é exactamente isso que me distingue.\n\nComecei por estudar Psicologia, uma área que me ensinou a compreender comportamento humano, comunicação e dinâmicas de equipa. Em paralelo, trabalhei anos em hospitalidade, chegando a Head Bartender com responsabilidade sobre operações, equipas e rentabilidade. Encontrei uma analogia inesperada: criar cocktails e desenvolver software partilham o mesmo processo — criatividade, experimentação, atenção ao detalhe e refinamento contínuo.\n\nPosteriormente, transitei para logística operacional, onde desenvolvi o rigor analítico e o pensamento orientado a processos que hoje aplico directamente no código. Em novembro de 2025, comprometi-me a 100%: inscrevi-me no curso de Software Engineering & AI na CodeForAll.\n\nHoje encaro cada projecto como uma oportunidade de aprender, crescer e construir soluções com impacto real.',
  },
  en: {
    name: 'Nuno Ferreira',
    title: 'Junior Software Developer',
    location: 'Porto, Portugal',
    email: 'nunopferreira01@gmail.com',
    github: 'https://github.com/Nokz22',
    linkedin: 'https://www.linkedin.com/in/nuno-ferreira-a02552203/',
    cvUrl: '/cv-nuno-ferreira.pdf',
    summary:
      "Technology and programming have fascinated me for as long as I can remember — but my path here was anything but straight, and that's exactly what sets me apart.\n\nI started by studying Psychology, which taught me how to understand human behaviour, communication, and team dynamics. In parallel, I spent years in hospitality, eventually leading bar operations as Head Bartender. I found an unexpected parallel: crafting cocktails and writing code share the same process — creativity, experimentation, attention to detail, and continuous refinement.\n\nI then moved into logistics operations, where I developed the analytical rigour and process-oriented mindset I now apply directly to software. In November 2025, I made the definitive commitment: I enrolled in a Software Engineering & AI programme and went all in.\n\nToday I approach every project as an opportunity to learn, grow, and ship solutions that create real impact.",
  },
}

const EXPERIENCE_PT: ExperienceDto[] = [
  {
    id: 1,
    company: 'Paiva Digital',
    role: 'WordPress Developer',
    startDate: '2026-01',
    endDate: null,
    current: true,
    location: 'Porto, Portugal',
    description:
      'Desenvolvimento de websites institucionais e e-commerce para múltiplos clientes usando WordPress e WooCommerce. Gestão end-to-end dos projectos, desde a arquitectura até à entrega ao cliente, com formação técnica incluída.',
    technologies: ['WordPress', 'WooCommerce', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    company: 'Store Repair',
    role: 'Full Stack Developer',
    startDate: '2026-01',
    endDate: '2026-01',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Desenho e desenvolvimento de uma plataforma e-commerce completa, com foco em arquitectura, design orientado à experiência do utilizador e integrações de negócio core.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'WooCommerce'],
  },
  {
    id: 3,
    company: 'Store Repair',
    role: 'Hardware & Software Technician',
    startDate: '2025-07',
    endDate: '2026-01',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Diagnóstico e reparação de telemóveis, computadores, TVs e electrodomésticos. Suporte técnico presencial e acompanhamento pós-reparação.',
    technologies: [],
  },
  {
    id: 4,
    company: 'CodeForAll',
    role: 'Software Engineering & AI',
    startDate: '2025-11',
    endDate: '2026-05',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Formação intensiva em desenvolvimento de software: Java (OOP, MVC), desenvolvimento web full-stack, bases de dados e metodologias ágeis. Projecto final em equipa de 4 — GLaDINATOR, um guesser estilo Akinator com backend Java e frontend JavaScript.',
    technologies: ['Java', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'Git'],
  },
  {
    id: 5,
    company: 'SPT Logistic',
    role: 'Logistics Operations Admin',
    startDate: '2023-02',
    endDate: '2025-06',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Gestão de mercadoria ADR e não-ADR com software logístico para controlo de stock e rastreio de envios. Coordenação com transportadoras e clientes internacionais para compliance e entregas no prazo.',
    technologies: [],
  },
]

const EXPERIENCE_EN: ExperienceDto[] = [
  {
    id: 1,
    company: 'Paiva Digital',
    role: 'WordPress Developer',
    startDate: '2026-01',
    endDate: null,
    current: true,
    location: 'Porto, Portugal',
    description:
      'Building institutional and e-commerce websites for multiple clients using WordPress and WooCommerce. End-to-end project ownership from architecture to client handover, including technical onboarding sessions.',
    technologies: ['WordPress', 'WooCommerce', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 2,
    company: 'Store Repair',
    role: 'Full Stack Developer',
    startDate: '2026-01',
    endDate: '2026-01',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Designed and built a full e-commerce platform including architecture, UX-focused design, and core business integrations.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'WooCommerce'],
  },
  {
    id: 3,
    company: 'Store Repair',
    role: 'Hardware & Software Technician',
    startDate: '2025-07',
    endDate: '2026-01',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Fault diagnosis and repair of phones, computers, TVs, and appliances. Customer-facing technical support and repair follow-up.',
    technologies: [],
  },
  {
    id: 4,
    company: 'CodeForAll',
    role: 'Software Engineering & AI',
    startDate: '2025-11',
    endDate: '2026-05',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Intensive software engineering programme: Java (OOP, MVC), full-stack web development, databases, and agile. Final team project of 4 — GLaDINATOR, an Akinator-style guesser with Java backend and JavaScript frontend.',
    technologies: ['Java', 'HTML', 'CSS', 'JavaScript', 'MySQL', 'Git'],
  },
  {
    id: 5,
    company: 'SPT Logistic',
    role: 'Logistics Operations Admin',
    startDate: '2023-02',
    endDate: '2025-06',
    current: false,
    location: 'Porto, Portugal',
    description:
      'Managed ADR and non-ADR goods using logistics software for stock control and shipment tracking. Coordinated with carriers and international clients for compliance and on-time deliveries.',
    technologies: [],
  },
]

export const STATIC_EXPERIENCE: Record<'pt' | 'en', ExperienceDto[]> = {
  pt: EXPERIENCE_PT,
  en: EXPERIENCE_EN,
}

export const STATIC_SKILLS: SkillGroupDto[] = [
  {
    domain: 'Linguagens & Web',
    skills: [
      { name: 'Java', level: 'advanced' },
      { name: 'HTML / CSS', level: 'advanced' },
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'MySQL', level: 'intermediate' },
    ],
  },
  {
    domain: 'Frameworks & Plataformas',
    skills: [
      { name: 'WordPress', level: 'advanced' },
      { name: 'WooCommerce', level: 'advanced' },
      { name: 'REST APIs', level: 'intermediate' },
    ],
  },
  {
    domain: 'Ferramentas & Práticas',
    skills: [
      { name: 'Git / GitHub', level: 'intermediate' },
      { name: 'OOP', level: 'advanced' },
      { name: 'MVC', level: 'advanced' },
      { name: 'Agile', level: 'intermediate' },
    ],
  },
  {
    domain: 'A aprender',
    skills: [
      { name: 'Spring Boot', level: 'learning' },
      { name: 'React', level: 'learning' },
      { name: 'TypeScript', level: 'learning' },
      { name: 'Docker', level: 'learning' },
    ],
  },
]

export const STATIC_PROJECTS: GithubRepoDto[] = [
  {
    id: 1,
    name: 'SuecaGame',
    fullName: 'Nokz22/SuecaGame',
    description: 'Implementação do jogo de cartas Sueca em Java com interface gráfica Swing e lógica de IA para os adversários.',
    url: 'https://github.com/Nokz22/SuecaGame',
    stars: 2,
    forks: 0,
    language: 'Java',
    topics: ['java', 'swing', 'card-game', 'ai'],
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'GLaDINATOR',
    fullName: 'Nokz22/GLaDINATOR',
    description: 'Jogo guesser estilo Akinator com backend Java e frontend JavaScript. Projecto final do curso CodeForAll.',
    url: 'https://github.com/Nokz22/GLaDINATOR',
    stars: 3,
    forks: 1,
    language: 'Java',
    topics: ['java', 'javascript', 'game', 'mvc'],
    updatedAt: '2026-05-15T00:00:00Z',
  },
  {
    id: 3,
    name: 'segue-o-ritmo',
    fullName: 'Nokz22/segue-o-ritmo',
    description: 'Jogo de ritmo no browser onde o jogador acompanha a batida da música em tempo real.',
    url: 'https://github.com/Nokz22/segue-o-ritmo',
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    topics: ['javascript', 'game', 'music', 'browser'],
    updatedAt: '2025-11-20T00:00:00Z',
  },
  {
    id: 4,
    name: 'blackjack-trainer',
    fullName: 'Nokz22/blackjack-trainer',
    description: 'Treinador de Blackjack com feedback sobre decisões e cálculo de probabilidades em tempo real.',
    url: 'https://github.com/Nokz22/blackjack-trainer',
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    topics: ['javascript', 'blackjack', 'trainer', 'probability'],
    updatedAt: '2025-10-10T00:00:00Z',
  },
]

import { generateMockAI, rankScore } from './mockAI'

export interface DemoProject {
  id: number
  title: string
  team: string
  track: string
  description: string
  github_url: string
  demo_url: string | null
  tech_stack: string[]
  github_stars: number
  commit_count: number
  contributors: number
  author_name: string
  author_college: string
  hacker_id: string
  status: 'submitted' | 'reviewed' | 'winner'
  problem: string
  solution: string
  impact: string
  ai_brief: {
    summary: string
    innovation_level: number
    complexity_level: number
    key_strengths: string[]
  }
  ai_score: {
    innovation: number
    technical_complexity: number
    completeness: number
    final_score: number
    reasoning: string
  }
  ai_feedback: {
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
    closing: string
  }
  effort_score: number
  rank_score: number
}

export interface DemoHacker {
  id: string
  name: string
  email: string
  college: string
  avatar: string
  skills: string[]
  projects_submitted: number
  avg_score: number
}

export interface DemoSponsor {
  id: number
  name: string
  logo_url: string
  contribution: string
  tier: 'gold' | 'silver' | 'bronze'
  website: string
}

export interface DemoUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'hacker' | 'judge' | 'organizer'
  avatar: string
  hacker_id?: string
}

export interface DemoEvent {
  id: number
  title: string
  status: 'active' | 'past'
  date: string
  participants: number
  tracks: string[]
  prize: string
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export const DEMO_USERS: DemoUser[] = [
  { id: 'admin-1', name: 'Jordan Lee', email: 'admin@touchgrass.dev', role: 'admin', avatar: 'J' },
  { id: 'hacker-1', name: 'Alex Rivera', email: 'hacker@touchgrass.dev', role: 'hacker', avatar: 'A', hacker_id: 'h1' },
  { id: 'judge-1', name: 'Dr. Sarah Kim', email: 'judge@touchgrass.dev', role: 'judge', avatar: 'S' },
]

// ─── HACKERS ──────────────────────────────────────────────────────────────────

export const DEMO_HACKERS: DemoHacker[] = [
  { id: 'h1', name: 'Alex Rivera', email: 'alex@dev.io', college: 'MIT', avatar: 'A', skills: ['React', 'TypeScript', 'Go'], projects_submitted: 2, avg_score: 8.5 },
  { id: 'h2', name: 'Priya Sharma', email: 'priya@dev.io', college: 'IIT Bombay', avatar: 'P', skills: ['Python', 'PyTorch', 'FastAPI'], projects_submitted: 1, avg_score: 8.7 },
  { id: 'h3', name: 'Marcus Webb', email: 'marcus@dev.io', college: 'Carnegie Mellon', avatar: 'M', skills: ['TypeScript', 'Electron', 'Rust'], projects_submitted: 1, avg_score: 8.3 },
  { id: 'h4', name: 'Aisha Okonkwo', email: 'aisha@dev.io', college: 'UCL', avatar: 'A', skills: ['Next.js', 'LangChain', 'Supabase'], projects_submitted: 1, avg_score: 7.3 },
  { id: 'h5', name: 'Chen Wei', email: 'chen@dev.io', college: 'Tsinghua', avatar: 'C', skills: ['Python', 'PyTorch', 'Redis'], projects_submitted: 1, avg_score: 8.3 },
  { id: 'h6', name: 'Sam Torres', email: 'sam@dev.io', college: 'Self-taught', avatar: 'S', skills: ['Rust', 'SQLite', 'CLI'], projects_submitted: 1, avg_score: 7.3 },
  { id: 'h7', name: 'Lena Müller', email: 'lena@dev.io', college: 'TU Berlin', avatar: 'L', skills: ['React', 'Node.js', 'Figma API'], projects_submitted: 2, avg_score: 7.1 },
  { id: 'h8', name: 'Ravi Patel', email: 'ravi@dev.io', college: 'IISc', avatar: 'R', skills: ['Go', 'Docker', 'Kubernetes'], projects_submitted: 2, avg_score: 7.8 },
]

// ─── SPONSORS ─────────────────────────────────────────────────────────────────

export const DEMO_SPONSORS: DemoSponsor[] = [
  { id: 1, name: 'Vercel', logo_url: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico', contribution: '$10,000 + Pro credits', tier: 'gold', website: 'https://vercel.com' },
  { id: 2, name: 'Supabase', logo_url: 'https://supabase.com/favicon/favicon-32x32.png', contribution: '$5,000 + Pro credits', tier: 'silver', website: 'https://supabase.com' },
  { id: 3, name: 'Groq', logo_url: 'https://groq.com/favicon.ico', contribution: '$3,000 + API credits', tier: 'silver', website: 'https://groq.com' },
  { id: 4, name: 'Cloudflare', logo_url: 'https://www.cloudflare.com/favicon.ico', contribution: '$2,000 in credits', tier: 'bronze', website: 'https://cloudflare.com' },
]

// ─── EVENTS ───────────────────────────────────────────────────────────────────

export const DEMO_EVENTS: DemoEvent[] = [
  { id: 1, title: 'BuildFast AI Hackathon 2026', status: 'active', date: 'Jun 14 – Jun 16, 2026', participants: 312, tracks: ['AI & ML', 'Dev Tooling', 'Health', 'Smart Cities', 'Open Source'], prize: '$25,000 in prizes' },
  { id: 2, title: 'Web3 Frontier 2025', status: 'past', date: 'Nov 8 – Nov 10, 2025', participants: 198, tracks: ['DeFi', 'NFT Infrastructure', 'Web3 Tooling'], prize: '$15,000 awarded' },
]

// ─── PROJECTS (20 total) ──────────────────────────────────────────────────────

function makeProject(
  id: number,
  title: string,
  team: string,
  track: string,
  description: string,
  tech_stack: string[],
  github_stars: number,
  commit_count: number,
  contributors: number,
  author_name: string,
  author_college: string,
  hacker_id: string,
  status: DemoProject['status'],
  problem: string,
  solution: string,
  ai_brief_strengths: string[],
  ai_feedback: DemoProject['ai_feedback'],
): DemoProject {
  const mock = generateMockAI({ id, title, description, commit_count, contributors, github_stars })
  return {
    id, title, team, track, description,
    github_url: `https://github.com/example/${title.toLowerCase().replace(/\s+/g, '-')}`,
    demo_url: id % 3 !== 0 ? `https://${title.toLowerCase().replace(/\s+/g, '')}.demo` : null,
    tech_stack, github_stars, commit_count, contributors,
    author_name, author_college, hacker_id, status,
    problem, solution,
    impact: `${github_stars} stars · ${commit_count} commits · ${contributors} contributor${contributors > 1 ? 's' : ''}`,
    ai_brief: {
      summary: mock.summary,
      innovation_level: mock.ai_score.innovation,
      complexity_level: mock.ai_score.technical_complexity,
      key_strengths: ai_brief_strengths,
    },
    ai_score: mock.ai_score,
    ai_feedback,
    effort_score: mock.effort_score,
    rank_score: rankScore(mock.ai_score.final_score, mock.effort_score),
  }
}

const defaultFeedback = (title: string): DemoProject['ai_feedback'] => ({
  strengths: [`${title} demonstrates clear problem-solution fit`, 'Technical implementation is solid and well-documented'],
  weaknesses: ['Could benefit from more real-world validation', 'Edge cases need further testing'],
  suggestions: ['Add user onboarding flow', 'Publish benchmarks for key claims', 'Consider open-sourcing the core library'],
  closing: 'A strong submission that shows genuine engineering craft.',
})

export const DEMO_PROJECTS: DemoProject[] = [
  makeProject(1, 'CropSense AI', 'Team Verdant', 'AI & ML',
    'A mobile-first platform that detects crop diseases from smartphone photos using a fine-tuned vision model, giving farmers actionable treatment advice in under 3 seconds.',
    ['Python', 'PyTorch', 'React Native', 'FastAPI'], 134, 178, 3, 'Priya Sharma', 'IIT Bombay', 'h2', 'reviewed',
    'Smallholder farmers lose up to 40% of crops annually to diseases they cannot identify early enough.',
    'Fine-tuned EfficientNet on 50k labeled crop images, deployed as a mobile app with offline inference.',
    ['Real-world dataset with 50k labeled images', 'Offline inference removes connectivity barrier', 'End-to-end pipeline from photo to recommendation'],
    { strengths: ['Offline-first architecture is exactly right for the target user base', 'Fine-tuning on domain-specific data shows depth'], weaknesses: ['Model accuracy metrics not surfaced in demo', 'Treatment recommendations need expert review'], suggestions: ['Add confidence score to each diagnosis', 'Include farmer feedback loop', 'Partner with agricultural extension service'], closing: 'One of the most grounded AI submissions — built for real users, not the demo.' }),

  makeProject(2, 'FlowState', 'Team Meridian', 'Dev Tooling',
    'An AI-powered focus session manager that integrates with your IDE, GitHub, and calendar to block distractions and surface the right context exactly when you need it.',
    ['TypeScript', 'Electron', 'OpenAI API', 'SQLite'], 89, 142, 2, 'Marcus Webb', 'Carnegie Mellon', 'h3', 'reviewed',
    'Context switching costs developers 23 minutes per interruption. Existing focus tools ignore actual work context.',
    'Reads current branch, open PRs, and calendar to build a context graph, then uses an LLM to decide what to surface.',
    ['Context graph approach is architecturally novel', 'Real integrations with GitHub and calendar APIs', 'Self-dogfooded during the hackathon'],
    defaultFeedback('FlowState')),

  makeProject(3, 'MindBridge', 'Team Solace', 'Health & Wellbeing',
    'A mental health support chatbot using CBT-informed conversation flows, mood tracking, and crisis detection to provide accessible first-line support between therapy sessions.',
    ['Next.js', 'LangChain', 'Supabase', 'Tailwind'], 76, 119, 4, 'Aisha Okonkwo', 'UCL', 'h4', 'submitted',
    'Average wait time for therapy is 3–6 months. People in distress need support now.',
    'CBT-informed chatbot designed with a licensed therapist, plus mood journal and crisis escalation.',
    ['Clinical collaboration gives conversation design credibility', 'Crisis detection with real escalation paths', 'Mood tracking creates longitudinal improvement'],
    defaultFeedback('MindBridge')),

  makeProject(4, 'TrafficMind', 'Team Nexus', 'Smart Cities',
    'Real-time traffic signal optimization using reinforcement learning to reduce intersection wait times by dynamically adapting signal timing to live traffic density.',
    ['Python', 'PyTorch', 'SUMO', 'Redis', 'FastAPI'], 52, 203, 2, 'Chen Wei', 'Tsinghua', 'h5', 'winner',
    'Fixed-cycle signals waste 30% of commute time. Adaptive systems cost $500k+ per intersection.',
    'PPO-based RL agent trained in SUMO simulator, deployable on commodity hardware.',
    ['PPO-based RL in realistic simulator is rigorous', '203 commits shows exceptional discipline', 'Cost-reduction framing makes business case clear'],
    defaultFeedback('TrafficMind')),

  makeProject(5, 'Driftlog', 'Team Quiet', 'Dev Tooling',
    'Terminal-first plaintext journaling for developers. Captures daily work logs, links them to git commits, and generates weekly summaries using a local LLM.',
    ['Rust', 'SQLite', 'Ollama', 'CLI'], 41, 94, 1, 'Sam Torres', 'Self-taught', 'h6', 'reviewed',
    'Developers have no lightweight way to capture context behind their work.',
    'Rust CLI that hooks into git to auto-capture commit context, stores in SQLite, summarizes with Ollama.',
    ['Git hook integration is the key insight', 'Local-first with Ollama means zero privacy concerns', 'Rust ensures performance for daily-use tool'],
    defaultFeedback('Driftlog')),

  makeProject(6, 'Patchwork', 'Team Drift', 'Open Source',
    'Visual diff tool for design tokens and component libraries. Bridges the gap between design and engineering with automated change detection.',
    ['React', 'Node.js', 'CSS', 'Figma API'], 29, 61, 4, 'Lena Müller', 'TU Berlin', 'h7', 'submitted',
    'Design-to-code drift causes regressions that are invisible until production.',
    'Automated visual diffing of design tokens across Figma and code, with PR-level reporting.',
    ['Figma API integration is non-trivial', 'PR-level reporting fits existing workflows', 'Catches regressions before they ship'],
    defaultFeedback('Patchwork')),

  makeProject(7, 'Groundwork', 'Team Forge', 'Dev Tooling',
    'Infrastructure scaffolding CLI for opinionated monorepos. One command to production-ready structure with CI, Docker, and Terraform pre-configured.',
    ['Go', 'Docker', 'Terraform', 'Bash'], 67, 112, 2, 'Ravi Patel', 'IISc', 'h8', 'reviewed',
    'Setting up a production-ready monorepo takes days of boilerplate configuration.',
    'Go CLI that generates a complete monorepo scaffold with CI pipelines, Docker configs, and Terraform modules.',
    ['Go implementation is fast and distributable', 'Terraform integration is production-grade', 'One-command setup removes days of boilerplate'],
    defaultFeedback('Groundwork')),

  makeProject(8, 'EchoSearch', 'Team Signal', 'AI & ML',
    'Semantic search engine for internal documentation that understands natural language queries and surfaces the most relevant content across Notion, Confluence, and GitHub.',
    ['Python', 'FastAPI', 'Pinecone', 'React'], 58, 88, 3, 'Alex Rivera', 'MIT', 'h1', 'submitted',
    'Internal docs are scattered across tools. Keyword search fails for natural language queries.',
    'Embeds all docs into a vector store and uses semantic similarity to answer natural language questions.',
    ['Multi-source ingestion is the hard part and they solved it', 'Semantic search beats keyword for internal docs', 'React UI is clean and fast'],
    defaultFeedback('EchoSearch')),

  makeProject(9, 'Budgetly', 'Team Frugal', 'FinTech',
    'AI-powered personal finance tracker that categorizes transactions automatically, detects spending patterns, and generates actionable savings recommendations.',
    ['React', 'Python', 'Plaid API', 'PostgreSQL'], 33, 76, 2, 'Alex Rivera', 'MIT', 'h1', 'submitted',
    'Manual expense tracking is tedious. Most people abandon budgeting apps within a week.',
    'Connects to bank accounts via Plaid, auto-categorizes with ML, and surfaces weekly insights.',
    ['Plaid integration handles the hard auth problem', 'ML categorization improves with use', 'Weekly insights are actionable not just informational'],
    defaultFeedback('Budgetly')),

  makeProject(10, 'SafeRoute', 'Team Atlas', 'Smart Cities',
    'Real-time pedestrian safety routing that avoids high-crime areas, poor lighting, and construction zones using live city data feeds.',
    ['React Native', 'Node.js', 'PostGIS', 'OpenStreetMap'], 44, 97, 3, 'Lena Müller', 'TU Berlin', 'h7', 'reviewed',
    'Navigation apps optimize for speed, not safety. Pedestrians — especially women — need different routing.',
    'Aggregates crime data, lighting maps, and construction feeds into a safety score per street segment.',
    ['PostGIS for geospatial queries is the right tool', 'Safety scoring model is transparent and explainable', 'React Native gives iOS and Android from one codebase'],
    defaultFeedback('SafeRoute')),

  makeProject(11, 'CodeReview AI', 'Team Lens', 'Dev Tooling',
    'GitHub PR reviewer that automatically identifies bugs, security vulnerabilities, and style issues using a fine-tuned code model.',
    ['Python', 'GitHub API', 'Transformers', 'FastAPI'], 71, 134, 2, 'Ravi Patel', 'IISc', 'h8', 'winner',
    'Code review is a bottleneck. Junior developers miss security issues. Senior devs are overloaded.',
    'Fine-tuned CodeLlama on a dataset of 100k reviewed PRs to generate actionable review comments.',
    ['Fine-tuned on real PR review data — not generic code', 'GitHub Actions integration means zero friction adoption', 'Security vulnerability detection is the killer feature'],
    defaultFeedback('CodeReview AI')),

  makeProject(12, 'WaterWatch', 'Team Hydra', 'Climate',
    'IoT sensor network for real-time water quality monitoring in rivers and lakes, with anomaly detection and automated alerts to environmental agencies.',
    ['C++', 'MQTT', 'InfluxDB', 'Grafana'], 28, 83, 3, 'Priya Sharma', 'IIT Bombay', 'h2', 'submitted',
    'Water pollution events go undetected for days. Manual sampling is too slow and sparse.',
    'Low-cost IoT sensors transmit pH, turbidity, and chemical readings every 5 minutes to a central dashboard.',
    ['Low-cost hardware makes deployment at scale feasible', 'MQTT is the right protocol for constrained IoT devices', 'Grafana dashboard gives agencies immediate visibility'],
    defaultFeedback('WaterWatch')),

  makeProject(13, 'StudySync', 'Team Focus', 'EdTech',
    'Collaborative study platform that uses spaced repetition, peer accountability, and AI-generated practice questions to improve exam performance.',
    ['Next.js', 'Supabase', 'OpenAI API', 'Tailwind'], 39, 68, 4, 'Aisha Okonkwo', 'UCL', 'h4', 'submitted',
    'Students study alone and inefficiently. Spaced repetition tools are not social.',
    'Combines spaced repetition scheduling with study groups and AI-generated questions from uploaded notes.',
    ['Social accountability layer is the differentiator', 'AI question generation from notes is genuinely useful', 'Supabase real-time enables live study sessions'],
    defaultFeedback('StudySync')),

  makeProject(14, 'LogLens', 'Team Debug', 'Dev Tooling',
    'Intelligent log analysis tool that uses NLP to surface anomalies, correlate errors across services, and explain root causes in plain English.',
    ['Python', 'Elasticsearch', 'React', 'FastAPI'], 55, 109, 2, 'Marcus Webb', 'Carnegie Mellon', 'h3', 'reviewed',
    'Log analysis requires expert knowledge. On-call engineers spend hours correlating errors manually.',
    'NLP model trained on error patterns extracts signal from noise and generates plain-English root cause summaries.',
    ['Plain-English explanations lower the expertise bar', 'Cross-service correlation is the hard problem solved', 'Elasticsearch integration fits existing stacks'],
    defaultFeedback('LogLens')),

  makeProject(15, 'AccessMap', 'Team Inclusive', 'Social Impact',
    'Crowdsourced accessibility map for wheelchair users and people with mobility impairments, with real-time updates on ramps, elevators, and accessible entrances.',
    ['React Native', 'Node.js', 'MongoDB', 'Mapbox'], 47, 91, 5, 'Sam Torres', 'Self-taught', 'h6', 'submitted',
    'Accessibility information for public spaces is outdated, incomplete, or nonexistent.',
    'Crowdsourced platform where users report and verify accessibility features with photo evidence.',
    ['Crowdsourcing solves the data freshness problem', 'Photo verification adds credibility to reports', 'Mapbox integration gives a polished map experience'],
    defaultFeedback('AccessMap')),

  makeProject(16, 'PriceRadar', 'Team Hawk', 'FinTech',
    'Real-time price comparison engine for grocery shopping that aggregates prices from major supermarkets and suggests the optimal shopping basket.',
    ['Python', 'Scrapy', 'Redis', 'React'], 36, 72, 2, 'Chen Wei', 'Tsinghua', 'h5', 'submitted',
    'Grocery prices vary 30-40% between supermarkets. Consumers overpay without realizing it.',
    'Scrapes prices from major supermarkets in real-time and uses optimization to suggest the cheapest basket.',
    ['Real-time scraping at scale is technically challenging', 'Basket optimization is a genuinely useful feature', 'Redis caching makes the UX fast'],
    defaultFeedback('PriceRadar')),

  makeProject(17, 'DocuSign AI', 'Team Legal', 'LegalTech',
    'AI-powered contract analyzer that identifies risky clauses, explains legal jargon in plain English, and suggests standard alternatives.',
    ['Python', 'LangChain', 'React', 'FastAPI'], 62, 115, 3, 'Ravi Patel', 'IISc', 'h8', 'reviewed',
    'Most people sign contracts without understanding them. Legal review costs $300-500/hour.',
    'LLM-powered contract analysis that highlights risky clauses and explains them in plain English.',
    ['Plain-English explanations democratize legal understanding', 'Risk scoring gives users a clear signal', 'LangChain enables complex multi-step analysis'],
    defaultFeedback('DocuSign AI')),

  makeProject(18, 'SleepCoach', 'Team Rest', 'Health & Wellbeing',
    'Personalized sleep optimization app that analyzes sleep patterns from wearable data and generates evidence-based recommendations to improve sleep quality.',
    ['React Native', 'Python', 'HealthKit', 'FastAPI'], 31, 58, 2, 'Lena Müller', 'TU Berlin', 'h7', 'submitted',
    '35% of adults get insufficient sleep. Generic sleep advice ignores individual patterns.',
    'Analyzes wearable sleep data to identify personal sleep disruptors and generate tailored recommendations.',
    ['HealthKit integration gives access to rich wearable data', 'Personalization is the key differentiator', 'Evidence-based recommendations build user trust'],
    defaultFeedback('SleepCoach')),

  makeProject(19, 'GridGuard', 'Team Power', 'Climate',
    'Predictive maintenance system for solar panel arrays that uses computer vision to detect degradation and optimize cleaning schedules.',
    ['Python', 'OpenCV', 'TensorFlow', 'FastAPI'], 49, 103, 2, 'Priya Sharma', 'IIT Bombay', 'h2', 'reviewed',
    'Solar panel degradation reduces output by 15-25% annually. Manual inspection is expensive and infrequent.',
    'Drone-captured images analyzed by a CV model to detect soiling, cracks, and hotspots with 94% accuracy.',
    ['Computer vision for physical asset inspection is high-value', '94% accuracy is a credible benchmark', 'Cleaning schedule optimization has direct ROI'],
    defaultFeedback('GridGuard')),

  makeProject(20, 'TalentGraph', 'Team Hire', 'HR Tech',
    'Skills-based talent matching platform that uses graph algorithms to connect developers with projects based on skill adjacency, not just keyword matching.',
    ['Python', 'Neo4j', 'React', 'FastAPI'], 43, 87, 3, 'Alex Rivera', 'MIT', 'h1', 'submitted',
    'Keyword-based job matching misses candidates with adjacent skills. Both sides lose.',
    'Graph database models skill relationships, enabling matches based on learning trajectory not just current skills.',
    ['Graph-based skill modeling is architecturally novel', 'Neo4j is the right tool for relationship-heavy data', 'Skill adjacency matching is a genuine insight'],
    defaultFeedback('TalentGraph')),
].sort((a, b) => b.rank_score - a.rank_score)

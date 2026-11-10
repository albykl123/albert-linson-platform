import json

data = {
  "personal": {
    "name": "Albert Linson K",
    "full_legal_name": "Albert Kalampadan Linson",
    "headline": "Building Intelligent Digital Experiences, Scalable Systems & AI Solutions",
    "sub_headline": "Data-Driven IT Professional | Full-Stack & UI/UX | Android | AI Systems | US IT Recruitment | Student Leader",
    "location": "Delhi, India",
    "email": "hello@albert.does.software",
    "secondary_email": "hello@albert.does.software",
    "phone": "+91 9910705796",
    "linkedin": "https://www.linkedin.com/in/albert-linson-k-63792b23a/",
    "github": "https://github.com/albykl123",
    "portfolio_url": "https://albert-linson-platform.albertkalampadan.workers.dev",
    "languages": [
      { "name": "English", "proficiency": "Fluent / Professional" },
      { "name": "Hindi", "proficiency": "Native" },
      { "name": "Malayalam", "proficiency": "Fluent" },
      { "name": "German", "proficiency": "Basic" }
    ],
    "bio": "Analytical IT professional with a Bachelor of Computer Applications (BCA) and currently pursuing a Master of Computer Applications (MCA) at CHRIST (Deemed to be University), Delhi NCR. Hands-on experience across US IT technical recruitment, business development, IT infrastructure management, frontend web development, and UI/UX design. Passionate about artificial intelligence, systems software, and computational research, with extensive leadership across university event management, student welfare, peer education, and media teams."
  },
  "summary": "Analytical IT professional with a Bachelor of Computer Applications (BCA) from CHRIST (Deemed to be University), Delhi NCR, and currently pursuing a Master of Computer Applications (MCA). Multidisciplinary background encompassing full-cycle US IT technical recruitment, IT infrastructure management, B2B business development, and frontend UI/UX design. Demonstrates proven leadership across university clubs, core event management, peer education, and media coordination, paired with rigorous academic research in medical ultrasound computing and LLM test reliability.",
  "skills": {
    "frontend_and_design": [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Bootstrap",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Figma",
      "Adobe XD",
      "UI/UX Design",
      "Responsive Web Design",
      "Android Studio"
    ],
    "backend_and_cloud": [
      "Python",
      "FastAPI",
      "SQL",
      "MySQL",
      "SQLite / Cloudflare D1",
      "Node.js",
      "RESTful API Design",
      "Cloudflare Workers & Pages",
      "Cloudflare R2",
      "Git & GitHub Actions",
      "Linux System Administration",
      "PowerShell Automation"
    ],
    "recruitment_and_business": [
      "Full-Cycle US IT Recruitment",
      "Talent Acquisition",
      "Candidate Sourcing",
      "ATS Tools & Screening",
      "Business Development",
      "IT Operations Management",
      "Event Management & Planning",
      "Team Leadership",
      "Media & Branding Coordination",
      "Peer Education & Mentoring"
    ],
    "analytics_and_ai": [
      "OpenRouter",
      "Ollama",
      "Hugging Face",
      "Google Colab",
      "Docker",
      "Artificial Intelligence",
      "Machine Learning",
      "Data Analysis",
      "Computational Analysis"
    ],
    "frontend_development": [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Bootstrap",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "programming_and_backend": [
      "Python",
      "FastAPI",
      "SQL",
      "MySQL",
      "SQLite / Cloudflare D1",
      "Node.js",
      "RESTful API Design"
    ],
    "android_development": [
      "Kotlin",
      "Jetpack Compose",
      "Android Studio",
      "Gradle",
      "Android UI Prototyping"
    ],
    "ai_and_development": [
      "OpenRouter",
      "Ollama",
      "Hugging Face",
      "Google Colab",
      "Docker",
      "Machine Learning",
      "Data Analysis",
      "Computational Analysis"
    ],
    "design": [
      "Figma",
      "Adobe XD",
      "UI/UX Design",
      "Responsive Web Design",
      "Wireframing & Prototyping"
    ],
    "development_tools": [
      "Git",
      "GitHub",
      "VS Code",
      "Linux System Administration",
      "Cloudflare Workers & Pages",
      "PowerShell Automation"
    ],
    "professional_skills": [
      "Full-Cycle US IT Recruitment",
      "Talent Acquisition",
      "Candidate Sourcing",
      "ATS Tools & Screening",
      "Business Development",
      "IT Operations Management",
      "Event Management & Planning",
      "Team Leadership",
      "Media & Branding Coordination",
      "Peer Education & Mentoring"
    ]
  },
  "skill_levels": {
    "professional_work": [
      { "name": "Full-Cycle US IT Recruitment", "category": "Recruitment & Talent", "evidence": "Innova Solutions: requirement mapping, technical screening, sourcing" },
      { "name": "Talent Sourcing & Candidate Screening", "category": "Recruitment & Talent", "evidence": "Innova Solutions & METVY LEARN: tech talent pipelines, ATS matching" },
      { "name": "IT Infrastructure & Operations", "category": "IT Operations", "evidence": "Herbal Energies: workstation maintenance, network uptime, vendor management" },
      { "name": "HTML5 / CSS3 / JavaScript", "category": "Frontend Development", "evidence": "MCD Civic Portal & Christ University academic web apps" },
      { "name": "Bootstrap", "category": "Frontend Development", "evidence": "MCD civic web portal responsive interfaces" },
      { "name": "Figma & Adobe XD", "category": "UI/UX Design", "evidence": "MCD citizen interfaces, grievance workflows, mobile wireframes" },
      { "name": "B2B Lead Generation & CRM", "category": "Business Development", "evidence": "Algo Spark Technologies: multi-channel outreach, proposals, client CRM" },
      { "name": "Linux System Administration", "category": "IT Operations", "evidence": "Herbal Energies workstations & Lunova OS development" },
      { "name": "Event Management & Operations", "category": "Leadership", "evidence": "Overall Event Management Head Corporate Club, Event Head St. Columba's & Aparoksha" },
      { "name": "Peer Education & Student Welfare", "category": "Student Engagement", "evidence": "CCHS Certified Peer Educator & Advanced Peer Educator at Christ University" }
    ],
    "project_experience": [
      { "name": "Next.js & React", "category": "Frontend Development", "evidence": "Albert Linson Platform, CINEMATRIX AI, AURIVA" },
      { "name": "TypeScript", "category": "Frontend Development", "evidence": "Albert Linson Platform, CINEMATRIX AI client applications" },
      { "name": "Tailwind CSS", "category": "Frontend Development", "evidence": "Modern responsive interfaces across web platform & portfolio" },
      { "name": "FastAPI & Uvicorn", "category": "Backend Development", "evidence": "ATSForge AI backend service & JARVIS local REST microservice" },
      { "name": "SQLite & Cloudflare D1", "category": "Database & Cloud", "evidence": "D1 relational persistence on Cloudflare Workers edge" },
      { "name": "Cloudflare Workers & OpenNext", "category": "Cloud Architecture", "evidence": "Production deployment of platform on edge Anycast CDN" },
      { "name": "C & x86 Assembly", "category": "Systems Engineering", "evidence": "Lunova OS protected-mode kernel, bootloader, interrupt handlers" },
      { "name": "Electron", "category": "Desktop Applications", "evidence": "JARVIS Desktop Assistant GUI and tray management" },
      { "name": "Android Studio", "category": "Mobile Development", "evidence": "MCD Android UI prototyping and mobile layout testing" },
      { "name": "Docker", "category": "DevOps & Containers", "evidence": "Containerized backend deployment and testing workflows" },
      { "name": "Git & GitHub Actions", "category": "DevOps & CI/CD", "evidence": "Automated test-and-deploy CI/CD pipeline with 100% test gates" }
    ],
    "academic_experience": [
      { "name": "Java & OOP Principles", "category": "Programming", "evidence": "Christ University BCA coursework and object-oriented architectures" },
      { "name": "C / C++ Programming", "category": "Systems Programming", "evidence": "BCA coursework, data structures implementation, algorithmic assignments" },
      { "name": "Relational Databases & MySQL", "category": "Database Systems", "evidence": "BCA database management systems, schema normalization, SQL querying" },
      { "name": "Data Structures & Algorithms", "category": "Computer Science Core", "evidence": "Analysis of computational complexity, tree/graph traversals, sorting" },
      { "name": "Computer Networks & Protocols", "category": "Computer Science Core", "evidence": "OSI layers, TCP/IP, client-server socket communication" }
    ],
    "currently_learning": [
      { "name": "Kotlin & Jetpack Compose", "category": "Mobile Development", "evidence": "Modern declarative Android UI development and Android architecture components" },
      { "name": "Ollama & Local LLMs", "category": "Artificial Intelligence", "evidence": "Local model orchestration, quantization, and offline inference experimentation" },
      { "name": "Hugging Face Transformers", "category": "Artificial Intelligence", "evidence": "Open-source NLP pipelines, tokenizers, and model fine-tuning exploration" },
      { "name": "Google Colab", "category": "Data Science", "evidence": "GPU-accelerated exploratory notebooks and ultrasound feature model training" }
    ]
  },
  "experience": [
    {
      "id": "exp-1",
      "role": "US IT Recruiter",
      "company": "Innova Solutions",
      "location": "Noida / Remote, India",
      "employment_type": "Full-Time",
      "period": "Dec 2025 – July 2026",
      "tools": ["ATS Tools", "LinkedIn Recruiter", "Job Portals", "Google Workspace", "Technical Screening Frameworks"],
      "responsibilities": [
        "Managed full-cycle US IT recruitment across demanding enterprise technology requisitions, covering talent sourcing, technical screening, interviews, and onboarding coordination.",
        "Streamlined US IT technical recruitment through structured requirement mapping, technical competency screening, and robust talent pipeline delivery.",
        "Collaborated directly with US-based account managers and client technical leads to translate complex job descriptions into actionable candidate screening criteria.",
        "Built and maintained candidate talent pipelines utilizing industry ATS tools, LinkedIn Recruiter, and technology job portals."
      ],
      "highlights": [
        "Streamlined US IT technical recruitment through structured requirement mapping, technical competency screening, and robust talent pipeline delivery.",
        "Built candidate talent pipelines utilizing industry ATS tools, LinkedIn Recruiter, and technology job portals.",
        "Collaborated with US-based account managers and technical leads to translate technical job descriptions into actionable screening criteria."
      ]
    },
    {
      "id": "exp-2",
      "role": "IT Manager",
      "company": "Herbal Energies",
      "location": "Delhi, India",
      "employment_type": "Full-Time",
      "period": "Oct 2024 – Dec 2024",
      "tools": ["Network Administration", "Hardware Procurement", "Linux / Windows", "Web CMS", "Data Security Protocols"],
      "responsibilities": [
        "Directed operational IT infrastructure, ensuring continuous uptime across local workstations, network equipment, and internal communication systems.",
        "Managed hardware and software procurement, data security protocols, and vendor relationships.",
        "Maintained and enhanced the company web presence, improving interface usability, navigation speed, and responsive layout across mobile and desktop devices."
      ],
      "highlights": [
        "Directed operational IT infrastructure, ensuring high uptime across workstations, network equipment, and internal communication systems.",
        "Maintained and enhanced company web presence, improving interface usability, navigation speed, and mobile responsiveness.",
        "Coordinated with external technology vendors and cross-functional teams to deliver software tools and technical initiatives on schedule."
      ]
    },
    {
      "id": "exp-3",
      "role": "Business Development Executive",
      "company": "Algo Spark Technologies",
      "location": "Delhi NCR, India",
      "employment_type": "Full-Time",
      "period": "Aug 2024 – Oct 2024",
      "tools": ["CRM Systems", "Lead Prospecting Tools", "B2B Sales Presentations", "Market Research Benchmarking"],
      "responsibilities": [
        "Generated new business opportunities and B2B client acquisition pipelines through outbound outreach, targeted communications, and multi-channel prospecting.",
        "Prepared customized business proposals, pitch decks, and technical demonstrations aligning client software requirements with service capabilities.",
        "Coordinated between prospective clients and technical engineering teams, maintaining accurate CRM records throughout the sales pipeline."
      ],
      "highlights": [
        "Generated qualified B2B client acquisition pipelines through targeted outreach and multi-channel prospecting.",
        "Conducted strategic market research and competitor benchmarking to identify growth segments for software product offerings.",
        "Cultivated long-term client relationships, delivering customized proposals and technical demonstrations that aligned client requirements with service capabilities."
      ]
    },
    {
      "id": "exp-4",
      "role": "HR Recruiter",
      "company": "METVY LEARN",
      "location": "Remote, India",
      "employment_type": "Full-Time / Contract (1 Year)",
      "period": "2024 (1 Year)",
      "tools": ["Talent Sourcing", "Interview Scheduling", "HR Documentation", "Candidate Coordination"],
      "responsibilities": [
        "Handled end-to-end recruitment coordination, talent sourcing, interview scheduling, and candidate documentation.",
        "Screened applicant profiles against specific cohort and role requirements, maintaining structured applicant tracking pipelines.",
        "Facilitated stakeholder communication between interviewers, mentors, and prospective candidates."
      ],
      "highlights": [
        "Managed recruitment, candidate scheduling, and documentation across 1 year of active talent acquisition operations.",
        "Streamlined interview scheduling workflows and maintained accurate candidate evaluation records."
      ]
    },
    {
      "id": "exp-5",
      "role": "Frontend Developer & UI/UX Designer (Intern)",
      "company": "Municipal Corporation of Delhi (MCD)",
      "location": "New Delhi, India",
      "employment_type": "Internship",
      "period": "May 2024 – Jul 2024 & Jan 2025 – Apr 2025",
      "tools": ["Figma", "Adobe XD", "HTML5", "CSS3", "JavaScript", "Bootstrap", "Android Studio"],
      "responsibilities": [
        "Designed and prototyped responsive citizen-facing user interfaces in Figma and Adobe XD, aligning with municipal usability standards.",
        "Modernized civic web interfaces and portal navigation using HTML, CSS, JavaScript, and Bootstrap.",
        "Collaborated with IT engineering staff on Android UI prototyping, mobile layout testing in Android Studio, and end-user IT training."
      ],
      "highlights": [
        "Designed accessible, mobile-first citizen interfaces and streamlined grievance redressal navigation compliant with municipal usability standards.",
        "Modernized civic web interfaces in Figma and Bootstrap, resolving high-friction citizen workflows.",
        "Supported Android UI prototyping and mobile layout testing in Android Studio."
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Master of Computer Applications (MCA)",
      "institution": "CHRIST (Deemed to be University)",
      "location": "Delhi NCR, India",
      "period": "Currently Pursuing (2024 – 2026)",
      "details": "Pursuing advanced master's curriculum focusing on Advanced Software Engineering, Cloud Architectures, Distributed Systems, and Applied Artificial Intelligence.",
      "specialization": "Artificial Intelligence & Advanced Software Systems"
    },
    {
      "id": "edu-2",
      "degree": "Bachelor of Computer Applications (BCA)",
      "institution": "CHRIST (Deemed to be University)",
      "location": "Delhi NCR, India",
      "period": "2022 – 2025",
      "details": "Graduated with Specialization in Advanced Technological Skills. Coursework covered Data Structures, Database Management Systems, Object-Oriented Programming, Computer Networks, Web Development, and Cloud Computing.",
      "specialization": "Advanced Technological Skills"
    },
    {
      "id": "edu-3",
      "degree": "Senior School Certificate Examination (Class XII — CBSE)",
      "institution": "St. Columba's School",
      "location": "New Delhi, India",
      "period": "2020 – 2022",
      "details": "Central Board of Secondary Education (CBSE). Focused on Computer Science and Mathematics. Actively participated in school IT equipment maintenance, disaster management team, and overall event management.",
      "specialization": "Computer Science & Mathematics"
    },
    {
      "id": "edu-4",
      "degree": "Secondary School Examination (Class X — CBSE)",
      "institution": "St. Columba's School",
      "location": "New Delhi, India",
      "period": "2019 – 2020",
      "details": "Central Board of Secondary Education (CBSE) Secondary School Examination.",
      "specialization": "General Science & Mathematics"
    }
  ],
  "leadership": [
    {
      "id": "lead-1",
      "title": "Disaster Management Team Member",
      "role_level": "Team Member",
      "organization": "St. Columba's School, New Delhi",
      "institution": "St. Columba's School, New Delhi",
      "period": "2020 – 2022",
      "category": "Disaster Management & Community Participation",
      "responsibilities": [
        "Participated in institutional safety preparedness protocols, evacuation drills, and campus emergency response simulations.",
        "Collaborated with faculty and student teams to promote safety awareness and rapid assistance protocols across secondary school cohorts."
      ],
      "skills": ["Disaster Preparedness", "Emergency Awareness", "Safety Awareness", "Preparedness Activities", "Team Collaboration"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-2",
      "title": "Event Head & Overall Event Management Core Team Head",
      "role_level": "Core Team Head",
      "organization": "St. Columba's School, New Delhi",
      "institution": "St. Columba's School, New Delhi",
      "period": "2019 – 2022",
      "category": "Leadership & Event Management",
      "responsibilities": [
        "Headed core event management operations for major institutional functions, annual celebrations, and inter-house competitions.",
        "Coordinated student logistics teams, technical stage crews, schedule planning, and venue arrangements to ensure seamless execution."
      ],
      "skills": ["Event Management", "Event Planning", "Event Operations", "Team Leadership", "Student Leadership", "Responsibility Ownership"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-3",
      "title": "Adikala — Music & Dance Team Member",
      "role_level": "Team Member",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2022 – 2025",
      "category": "Cultural & Campus Engagement",
      "responsibilities": [
        "Contributed to departmental cultural productions, musical rehearsals, and collaborative artistic showcases within the School of Sciences.",
        "Supported stage team coordination, prop logistics, and schedule management during inter-departmental university fests."
      ],
      "skills": ["Cultural Coordination", "Team Collaboration", "Interpersonal Communication", "Student Engagement"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-4",
      "title": "Corporate Club — Club Member",
      "role_level": "Member",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2022 – 2025",
      "category": "Leadership & Event Management",
      "responsibilities": [
        "Participated in professional development seminars, guest speaker symposiums, and industry transition workshops organized by the Corporate Club.",
        "Assisted in coordinating campus corporate interface events and student business challenge sessions."
      ],
      "skills": ["Corporate Relations", "Professional Development", "Event Coordination", "Team Collaboration"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-5",
      "title": "Student Welfare Office (SWO) — Art & Literary Club Member",
      "role_level": "Member",
      "organization": "Student Welfare Office (SWO)",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2022 – 2024",
      "category": "Cultural & Campus Engagement",
      "responsibilities": [
        "Active member for 2 years contributing to university literary events, creative writing workshops, and cultural fests.",
        "Assisted in documentation, event announcements, stage assistance, and peer participant facilitation during major university campus festivals."
      ],
      "skills": ["Student Welfare", "Literary Events", "Public Communication", "Event Support", "Creative Coordination"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-6",
      "title": "Peer Educator",
      "role_level": "Peer Educator",
      "organization": "Centre for Counselling & Health Services (CCHS)",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2022 – 2025",
      "category": "Student Welfare & Peer Education",
      "responsibilities": [
        "Completed structured peer education training under CCHS to support student orientation, well-being awareness, and healthy university community living.",
        "Facilitated peer-level wellness sessions, anti-stress initiatives, and community discussions; connected fellow students with official CCHS university counselling resources.",
        "Maintained peer support ethics, active listening, and confidential student guidance boundaries without acting as a clinical therapist."
      ],
      "skills": ["Peer Education", "Peer Mentoring", "Student Engagement", "Health Awareness", "Student Well-being", "Interpersonal Communication"],
      "progression_note": "Foundational peer mentorship role (2022–2025), advancing to Advanced Peer Educator (2026–2028).",
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-7",
      "title": "Technical & Media Team Leader",
      "role_level": "Team Leader",
      "organization": "Centre for Counselling & Health Services (CCHS)",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2023 – 2025",
      "category": "Branding, Media & Communications",
      "responsibilities": [
        "Led the student technical and digital media crew responsible for CCHS event promotion, campaign graphics, and audio/video setups for university wellness workshops.",
        "Oversaw digital content creation, workshop presentations, and technical stage setups across university counselling awareness events."
      ],
      "skills": ["Media Coordination", "Technical Coordination", "Team Leadership", "Digital Media", "Branding", "Content Coordination"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-8",
      "title": "Branding & Media Team Member",
      "role_level": "Member",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2026 – Present",
      "category": "Branding, Media & Communications",
      "responsibilities": [
        "Designs digital promotional material, social media creative assets, and official announcements representing School of Sciences events.",
        "Coordinates branding guidelines and multimedia documentation across academic symposiums and student club initiatives."
      ],
      "skills": ["Branding", "Digital Media", "Content Coordination", "Stakeholder Communication", "Media Coordination"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-9",
      "title": "Corporate Club — Core Team Member & Overall Event Management Head",
      "role_level": "Core Team Member & Overall Event Management Head",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2026 – Present",
      "category": "Leadership & Event Management",
      "responsibilities": [
        "Serves as the executive head of overall event management for the School of Sciences Corporate Club, directing event planning, operational schedules, and execution teams.",
        "Leads student committee heads in coordinating industry corporate sessions, alumni speaker panels, and professional networking symposiums.",
        "Ensures end-to-end accountability, cross-functional crew alignment, and professional decorum across all club activities."
      ],
      "skills": ["Event Management", "Event Leadership", "Event Planning", "Event Operations", "Team Leadership", "Programme Coordination", "Responsibility Ownership"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-10",
      "title": "SDG Cell — Member",
      "role_level": "Member",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2026 – Present",
      "category": "Sustainability & Institutional Engagement",
      "responsibilities": [
        "Contributes to United Nations Sustainable Development Goals (SDG) awareness campaigns, sustainability drives, and institutional campus initiatives.",
        "Organizes student awareness workshops focusing on sustainable tech practices, waste reduction, and community environmental responsibility."
      ],
      "skills": ["Sustainable Development Awareness", "SDG Engagement", "Institutional Participation", "Public Communication", "Team Collaboration"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-11",
      "title": "Advanced Peer Educator",
      "role_level": "Team Leader",
      "organization": "Centre for Counselling & Health Services (CCHS)",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2026 – 2028",
      "category": "Student Welfare & Peer Education",
      "responsibilities": [
        "Advanced peer leadership appointment following multi-year service as Peer Educator (2022–2025); mentors junior peer educators and coordinates wellness outreach programs.",
        "Assists CCHS professional staff in organizing university-wide student mental health awareness weeks, stress mitigation drives, and orientation bootcamps.",
        "Promotes student well-being advocacy with strict ethical boundaries, serving as a trusted student liaison to professional counselling services."
      ],
      "skills": ["Peer Mentoring", "Peer Education", "Student Leadership", "Student Well-being", "Student Welfare", "Health Awareness", "Interpersonal Communication"],
      "progression_note": "Direct progression from Peer Educator (2022–2025) to Advanced Peer Educator (2026–2028). Verified source period 2026–2028.",
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-12",
      "title": "Aparoksha 2022 — Event Head",
      "role_level": "Event Head",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2022",
      "year": 2022,
      "category": "Leadership & Event Management",
      "responsibilities": [
        "Served as Event Head for the flagship science festival Aparoksha 2022, managing competition tracks, participant registration, and judge coordination.",
        "Supervised event volunteer crews, stage setup, timing schedules, and prize distribution workflows to ensure punctual festival execution."
      ],
      "skills": ["Event Execution", "Event Planning", "Event Operations", "Team Coordination", "Team Leadership"],
      "verification_status": "Verified",
      "public_visibility": True
    },
    {
      "id": "lead-13",
      "title": "Aparoksha 2023 — Event Head",
      "role_level": "Event Head",
      "organization": "School of Sciences",
      "institution": "CHRIST (Deemed to be University), Delhi NCR",
      "period": "2023",
      "year": 2023,
      "category": "Leadership & Event Management",
      "responsibilities": [
        "Re-appointed as Event Head for Aparoksha 2023 following successful delivery in 2022, expanding competition tracks and technical exhibits.",
        "Directed operational scheduling, stage technology, participant management, and student crew supervision throughout the multi-day festival."
      ],
      "skills": ["Event Leadership", "Event Operations", "Programme Coordination", "Responsibility Ownership", "Stakeholder Communication"],
      "verification_status": "Verified",
      "public_visibility": True
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Python Programming Masterclass",
      "issuer": "Udemy",
      "year": "Verified",
      "description": "Comprehensive practical programming covering data structures, OOP, file I/O, and algorithmic problem solving."
    },
    {
      "id": "cert-2",
      "name": "Microsoft Office Suite 2013 Certification",
      "issuer": "Microsoft / Certified Training",
      "year": "Verified",
      "description": "Advanced spreadsheet analysis, document automation, and executive presentation preparation."
    },
    {
      "id": "cert-3",
      "name": "Certified Peer Educator",
      "issuer": "Centre for Counselling & Health Services (CCHS), CHRIST (Deemed to be University)",
      "year": "Verified",
      "description": "Peer mentorship recognition, student mental health awareness, and student community leadership."
    },
    {
      "id": "cert-4",
      "name": "SWO Art & Literary Club Member (2 Years)",
      "issuer": "Student Welfare Office (SWO), CHRIST (Deemed to be University)",
      "year": "Verified",
      "description": "Active participation in institutional literary events, debate moderation, and cultural fest coordination."
    }
  ],
  "research": [
    {
      "id": "res-1",
      "title": "AEGIS-Test: Adaptive Evidence-Guided Iterative Synthesis for Reliable LLM-Based Software Testing",
      "role": "Lead Author & Architect",
      "status": "Manuscript Completed",
      "category": "Software Engineering & LLM Reliability",
      "abstract": "While Large Language Models (LLMs) can rapidly draft software tests, their output frequently suffers from hallucinated assertions, unexecutable test harnesses, and semantic coverage gaps. AEGIS-Test introduces an adaptive, evidence-guided iterative synthesis framework that pairs LLM code generation with deterministic execution feedback, AST static validation, and dynamic mutation testing. Experimental results show a 42% reduction in non-compiling test cases and significant branch-coverage improvement over raw LLM zero-shot prompts.",
      "objectives": [
        "Mitigate LLM hallucination in automated test suite generation.",
        "Construct an automated feedback loop combining Python AST analysis and runtime execution logs.",
        "Benchmark branch coverage and mutation score against industry baselines."
      ],
      "methodology": "Iterative prompt synthesis guided by execution trace analysis, semantic mutation scoring, and assertion boundary checking.",
      "paper_url": "#"
    },
    {
      "id": "res-2",
      "title": "A Computational Perspective on Breast Cancer Detection in Ultrasound: Fusion of Multi-Image Modalities",
      "role": "Lead Researcher & Author",
      "status": "Completed / Under Review",
      "category": "Medical Imaging & Deep Learning",
      "abstract": "Ultrasound imaging is an essential diagnostic tool in oncology, but standard B-mode sonography frequently suffers from speckle noise, low contrast, and operator dependency. This research presents a computational approach fusing multi-image ultrasound modalities (B-mode and Doppler) through deep convolutional feature extraction. Evaluated across benchmark sonographic datasets, the fused pipeline demonstrates substantial gains in diagnostic sensitivity, specificity, and AUC-ROC, providing a dependable computational aid for early oncological screening.",
      "objectives": [
        "Investigate computational limitations of single-modality B-mode ultrasound.",
        "Engineer a multi-image feature fusion architecture combining acoustic reflectance and vascular Doppler signals.",
        "Demonstrate measurable diagnostic accuracy improvements over standard single-image baselines."
      ],
      "methodology": "Pre-processing via adaptive speckle filtering, dual-stream convolutional neural feature extraction, cross-attention feature fusion layer, and binary lesion classification with Bayesian uncertainty estimation.",
      "paper_url": "https://docs.google.com/document/d/1pZqEWrk24sMGyOaCC40F2IFIjeQafLdA/edit?usp=sharing"
    }
  ],
  "projects": [
    {
      "id": "proj-jarvis",
      "title": "JARVIS Personal AI Desktop Assistant",
      "tagline": "Offline-First Autonomous Desktop Intelligence & Voice Assistant",
      "description": "A production-grade, multimodal desktop assistant engineered in Python and Electron. Features offline wake-word detection, local speech recognition (Faster-Whisper), system telemetry monitoring, desktop automation, and flexible LLM orchestration.",
      "technologies": ["Python 3.14", "Electron", "Faster-Whisper", "PyAudio", "FastAPI", "Uvicorn"],
      "architecture": "Electron front-end communicating over local WebSocket/REST to a high-performance Python FastAPI background worker, running local speech recognition and system automation APIs.",
      "my_contribution": "Designed the dual-process architecture, implemented low-latency wake-word detection, built the Electron tray interface, and created the modular LLM provider failover pipeline.",
      "highlights": [
        "Engineered low-latency wake-word detection running locally with <80MB RAM footprint.",
        "Implemented Electron GUI with desktop tray controls, system metrics graphs, and real-time audio visualization.",
        "Integrated multi-provider AI backends with automatic failover between local and cloud APIs."
      ],
      "github_url": "https://github.com/albykl123/jarvis-assistant",
      "status": "Completed & Tested"
    },
    {
      "id": "proj-lunova",
      "title": "Lunova OS",
      "tagline": "Custom 32-Bit x86 Protected Mode Educational Operating System",
      "description": "An operating system written from scratch featuring a custom bootloader, kernel in C, memory management, interrupt descriptor tables (IDT), VGA text console driver, and keyboard input handlers.",
      "technologies": ["C", "x86 Assembly", "QEMU", "Makefile", "GDB"],
      "architecture": "Two-stage bootloader transitioning CPU from 16-bit Real Mode to 32-bit Protected Mode, direct hardware interrupt handling via 8259 PIC, and memory management subsystems.",
      "my_contribution": "Wrote the x86 assembly bootloader, designed kernel interrupt vectors, implemented VGA video drivers and keyboard scancode decoders, and structured the build system with Makefile and QEMU emulation.",
      "highlights": [
        "Built two-stage bootloader transitioning CPU from 16-bit Real Mode to 32-bit Protected Mode.",
        "Implemented kernel memory paging, segmentation, and hardware timer interrupt handlers (PIC/PIT).",
        "Created an interactive command-line shell with system diagnostic commands."
      ],
      "github_url": "https://github.com/albykl123/lunova-os",
      "status": "Active Research Project"
    },
    {
      "id": "proj-atsforge",
      "title": "ATSForge AI",
      "tagline": "Deterministic ATS Resume Intelligence & Career Optimization Platform",
      "description": "Comprehensive resume optimization platform featuring a 20-rule deterministic ATS compatibility engine, job description extractor, keyword gap analyzer, zero-hallucination factuality guard, and vector PDF/DOCX exporters.",
      "technologies": ["FastAPI", "Python", "SQLAlchemy", "ReportLab", "python-docx", "Pydantic v2", "Next.js"],
      "architecture": "FastAPI microservices coupled with an edge Next.js frontend, utilizing deterministic rule engines, AST parsing, and zero-table document formatting generators.",
      "my_contribution": "Architected the 20-rule ATS scoring engine, engineered the Factuality Guard preventing AI hallucination, and built the native vector PDF and DOCX document exporters.",
      "highlights": [
        "Created 20-rule deterministic ATS scoring system returning 0-100 score and actionable one-click fixes.",
        "Developed genuine vector PDF generator using ReportLab and native DOCX generator with 0 tables for pure ATS parseability.",
        "Integrated strict Factuality Guard replacing hallucinated claims with structured placeholders."
      ],
      "github_url": "https://github.com/albykl123/atsforge-ai",
      "status": "Production-Ready"
    },
    {
      "id": "proj-cinematrix",
      "title": "CINEMATRIX AI",
      "tagline": "AI-Powered Movie Intelligence & Visual Recommendation Engine",
      "description": "An intelligent entertainment platform utilizing content-based filtering, narrative sentiment analysis, and mood-driven recommendations to help cinema enthusiasts discover films with high thematic precision.",
      "technologies": ["React", "TypeScript", "Tailwind CSS", "FastAPI", "Scikit-Learn"],
      "architecture": "Scikit-Learn vector similarity engine exposed via FastAPI, consumed by a fluid React and TypeScript frontend with dynamic trailer embeds.",
      "my_contribution": "Implemented TF-IDF and cosine similarity matrix matching over movie plot synopses, genres, and directors, and created the responsive cinematic user interface.",
      "highlights": [
        "Constructed vector similarity search matching plot synopses, cinematic tropes, and director styles.",
        "Designed cinematic UI with fluid poster transitions, thematic filtering, and trailer previews."
      ],
      "github_url": "https://github.com/albykl123/cinematrix-ai",
      "status": "Completed"
    },
    {
      "id": "proj-auriva",
      "title": "AURIVA",
      "tagline": "Interactive Audio Experience & Digital Sound Interface",
      "description": "A high-performance interactive web application exploring modern Web Audio APIs, procedural audio-reactive visual animations, and responsive micro-interactions.",
      "technologies": ["Next.js", "Web Audio API", "Tailwind CSS", "Canvas API"],
      "architecture": "Client-side Web Audio API audio graph analyzing frequency spectrum in real-time, driving procedural 60fps canvas visualizer loops.",
      "my_contribution": "Engineered the frequency analyser node pipeline, built the procedural audio-reactive visualizer canvas, and implemented playlist management.",
      "highlights": [
        "Engineered real-time audio-reactive procedural canvas visualizations reacting to audio frequency bins.",
        "Created responsive playlist controls and spatial audio filter adjustments."
      ],
      "github_url": "https://github.com/albykl123/auriva",
      "status": "Completed"
    },
    {
      "id": "proj-mcd",
      "title": "Municipal Corporation of Delhi (MCD) Dashboard",
      "tagline": "Citizen Civic Services & Public Infrastructure Portal",
      "description": "Civic services dashboard designed and prototyped for the Municipal Corporation of Delhi, unifying citizen complaint tracking, public sanitation metrics, and municipal service status into an accessible, responsive web interface.",
      "technologies": ["Figma", "Adobe XD", "HTML5", "CSS3", "JavaScript", "Bootstrap"],
      "architecture": "Modular, mobile-first responsive web portal designed in compliance with municipal accessibility guidelines.",
      "my_contribution": "Led UI/UX prototyping in Figma and Adobe XD, wrote responsive HTML/CSS/Bootstrap frontend components, and conducted usability walkthroughs.",
      "highlights": [
        "Designed accessible, mobile-first citizen interfaces and streamlined grievance redressal navigation compliant with municipal usability standards.",
        "Conducted end-user usability testing across diverse citizen demographics in Delhi."
      ],
      "github_url": "https://github.com/albykl123/mcd-civic-dashboard",
      "status": "Deployed & Verified"
    },
    {
      "id": "proj-bots",
      "title": "FunBot & SpeechoBot",
      "tagline": "Conversational Bot & Speech Recognition Systems",
      "description": "A suite of conversational chatbots and voice synthesis experiments exploring natural language command parsing, text-to-speech audio pipelines, and interactive utility bots.",
      "technologies": ["Python", "SpeechRecognition", "Pyttsx3", "Tkinter", "NLTK"],
      "architecture": "Local Python voice synthesis pipeline integrating speech recognition microphones, acoustic tokenization, and conversational response handlers.",
      "my_contribution": "Built voice command parsers, connected offline speech recognition engines, and created an interactive desktop testing utility.",
      "highlights": [
        "Implemented hands-free voice command execution for common system tasks.",
        "Designed conversational response trees with natural speech synthesis."
      ],
      "github_url": "https://github.com/albykl123/speechobot",
      "status": "Completed"
    },
    {
      "id": "proj-platform",
      "title": "Albert Linson Personal Intelligence Platform",
      "tagline": "Cloud-Native Professional Identity & Career Operating System",
      "description": "Production-grade, zero-cost cloud platform combining a public recruiter portfolio, research showcase, 1,369-tool FreeStack catalog, and private ATS career management studio running on Cloudflare Workers edge.",
      "technologies": ["Next.js 14", "OpenNext", "Cloudflare Workers", "Cloudflare D1", "TypeScript", "Tailwind CSS"],
      "architecture": "OpenNext Cloudflare Workers edge architecture with D1 SQLite persistence, server-side OpenRouter AI gateway, and multi-design theme token system.",
      "my_contribution": "Architected end-to-end full-stack platform, CI/CD GitHub Actions deployment pipeline, cryptographic session security, and four-theme design system.",
      "highlights": [
        "Deployed to global Cloudflare Anycast edge with sub-100ms API latency and 100% test pass rate.",
        "Built unified four-theme design system (Swiss Editorial, Warm Ivory, Modern Corporate, Paper & Typography)."
      ],
      "github_url": "https://github.com/albykl123/albert-linson-platform",
      "status": "Live Production"
    }
  ]
}

# Write to packages/shared/profile_data.json
with open('packages/shared/profile_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Write to apps/web/src/data/profile_data.json
with open('apps/web/src/data/profile_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Successfully synchronized profile_data.json!")
print(f"- Personal Name: {data['personal']['name']}")
print(f"- Leadership entries: {len(data['leadership'])} (Expected 13)")
print(f"- Research entries: {len(data['research'])} (Expected exactly 2)")
print(f"- Projects entries: {len(data['projects'])} (Expected 8)")
print(f"- Experience entries: {len(data['experience'])} (Expected 5 including METVY LEARN)")

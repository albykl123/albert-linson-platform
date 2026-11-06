import json
import os

# Load existing profile to preserve projects and deep metadata
with open('packages/shared/profile_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 1. Personal Information Updates from Resume
data['personal']['name'] = 'Albert Linson'
data['personal']['full_legal_name'] = 'Albert Kalampadan Linson'
data['personal']['email'] = 'albertkalampadan@gmail.com'
data['personal']['secondary_email'] = 'albertkalampadan@gmail.com'
data['personal']['phone'] = '+91 9910705796'
data['personal']['location'] = 'Delhi, India'
data['personal']['headline'] = 'US IT Recruiter & Full-Stack Technologist | MCA Candidate'
data['personal']['sub_headline'] = 'US IT Recruitment | IT Operations & Management | Business Development | Frontend & UI/UX'

summary_text = (
    "Results-driven professional with a Bachelor of Computer Applications and currently pursuing a Master of Computer Applications (MCA). "
    "Experienced in US IT recruitment, business development, IT operations, frontend development and UI/UX design. Demonstrated leadership "
    "in institutional event management, public relations, technical coordination and cross-functional team management. Skilled in talent "
    "sourcing, stakeholder engagement, client relationship management and operational execution, with academic research experience in "
    "medical imaging and computational analysis."
)
data['personal']['bio'] = summary_text
data['summary'] = summary_text

# 2. Skills categorized as per resume
data['skills'] = {
    "recruitment_and_hr": [
        "US IT Recruitment",
        "Talent Sourcing",
        "Candidate Screening",
        "ATS",
        "Interview Coordination",
        "Talent Acquisition"
    ],
    "business_development": [
        "Lead Generation",
        "Client Acquisition",
        "Cold Calling",
        "Market Research",
        "Client Relationship Management"
    ],
    "leadership_and_operations": [
        "Event Management",
        "Team Leadership",
        "Public Relations",
        "Stakeholder Management",
        "Operations Management",
        "Cross-functional Coordination"
    ],
    "design_and_development": [
        "HTML",
        "CSS",
        "JavaScript",
        "Bootstrap",
        "Figma",
        "Adobe XD",
        "UI/UX Design"
    ],
    "tools_and_technologies": [
        "Git",
        "GitHub",
        "Android Studio",
        "Kotlin",
        "Jetpack Compose",
        "Microsoft Office"
    ],
    "frontend_and_design": [
        "HTML",
        "CSS",
        "JavaScript",
        "Bootstrap",
        "Figma",
        "Adobe XD",
        "UI/UX Design",
        "Responsive Design"
    ],
    "backend_and_cloud": [
        "Git",
        "GitHub",
        "Android Studio",
        "Kotlin",
        "Jetpack Compose",
        "Microsoft Office",
        "Python",
        "FastAPI",
        "SQLite / Cloudflare D1",
        "Cloudflare Workers & Pages"
    ],
    "recruitment_and_business": [
        "US IT Recruitment",
        "Talent Sourcing",
        "Candidate Screening",
        "ATS Platforms",
        "Interview Coordination",
        "Talent Acquisition",
        "Lead Generation",
        "Client Acquisition",
        "Cold Calling",
        "Market Research",
        "Client Relationship Management"
    ],
    "analytics_and_ai": [
        "Medical Imaging",
        "Computational Analysis",
        "AI-assisted Healthcare Applications",
        "Ultrasound Multi-Image Modality Fusion",
        "Deep Learning Feature Extraction",
        "OpenRouter"
    ]
}

# 3. Professional Experience (Matching Resume Exactly)
data['experience'] = [
    {
        "id": "exp-1",
        "role": "US IT Recruiter",
        "company": "Innova Solutions",
        "location": "Noida / Remote, India",
        "employment_type": "Full-Time",
        "period": "December 2025 – Present",
        "tools": [
            "ATS Platforms",
            "Job Portals",
            "Professional Networks",
            "Technical Screening",
            "Client Collaboration",
            "Candidate Sourcing"
        ],
        "responsibilities": [
            "Manage end-to-end US IT recruitment, including sourcing, screening, evaluation, submissions and onboarding.",
            "Build candidate pipelines using ATS platforms, job portals and professional networks.",
            "Collaborate with US-based clients and hiring managers to fulfil technical staffing requirements.",
            "Improved placement success rate by approximately 70% through effective candidate screening.",
            "Work toward weekly recruitment targets, submission quotas and hiring deliverables."
        ],
        "highlights": [
            "Manage end-to-end US IT recruitment, including sourcing, screening, evaluation, submissions and onboarding.",
            "Build candidate pipelines using ATS platforms, job portals and professional networks.",
            "Collaborate with US-based clients and hiring managers to fulfil technical staffing requirements.",
            "Improved placement success rate by approximately 70% through effective candidate screening.",
            "Work toward weekly recruitment targets, submission quotas and hiring deliverables."
        ]
    },
    {
        "id": "exp-2",
        "role": "IT Manager",
        "company": "Herbal Energy",
        "location": "Delhi, India",
        "employment_type": "Full-Time",
        "period": "October 2025 – November 2025",
        "tools": [
            "IT Infrastructure",
            "Technical Operations",
            "Website Maintenance",
            "UI/UX Enhancements",
            "Vendor Coordination"
        ],
        "responsibilities": [
            "Oversaw IT infrastructure, technical operations and day-to-day technology requirements.",
            "Managed website maintenance and enhancements, improving user interface and functionality.",
            "Coordinated with vendors and internal stakeholders to support seamless IT operations."
        ],
        "highlights": [
            "Oversaw IT infrastructure, technical operations and day-to-day technology requirements.",
            "Managed website maintenance and enhancements, improving user interface and functionality.",
            "Coordinated with vendors and internal stakeholders to support seamless IT operations."
        ]
    },
    {
        "id": "exp-3",
        "role": "Business Development Executive",
        "company": "Algospark Technologies",
        "location": "Delhi NCR, India",
        "employment_type": "Full-Time",
        "period": "August 2025 – October 2025",
        "tools": [
            "Cold Calling",
            "Email Outreach",
            "Lead Generation",
            "Market Research",
            "Client Relationship Management",
            "Sales Proposals & Presentations"
        ],
        "responsibilities": [
            "Generated business opportunities through cold calling, email outreach and lead-generation strategies.",
            "Developed client relationships and conducted market research to identify prospective customers and growth opportunities.",
            "Aligned client requirements with internal service offerings and supported proposals, presentations and sales reports."
        ],
        "highlights": [
            "Generated business opportunities through cold calling, email outreach and lead-generation strategies.",
            "Developed client relationships and conducted market research to identify prospective customers and growth opportunities.",
            "Aligned client requirements with internal service offerings and supported proposals, presentations and sales reports."
        ]
    },
    {
        "id": "exp-4",
        "role": "Frontend Developer & UI/UX Designer Intern",
        "company": "Municipal Corporation of Delhi",
        "location": "New Delhi, India",
        "employment_type": "Internship",
        "period": "May 2024 – April 2025",
        "tools": [
            "Figma",
            "Adobe XD",
            "HTML",
            "CSS",
            "JavaScript",
            "Bootstrap",
            "UI/UX Design",
            "Responsive Web Design"
        ],
        "responsibilities": [
            "Designed user-centric interfaces using Figma and Adobe XD and improved website usability and responsiveness.",
            "Contributed to frontend enhancements and a better digital user experience.",
            "Helped reduce user-reported interface issues by approximately 70%."
        ],
        "highlights": [
            "Designed user-centric interfaces using Figma and Adobe XD and improved website usability and responsiveness.",
            "Contributed to frontend enhancements and a better digital user experience.",
            "Helped reduce user-reported interface issues by approximately 70%."
        ]
    },
    {
        "id": "exp-5",
        "role": "HR Recruiter",
        "company": "METVY LEARN",
        "location": "Remote, India",
        "employment_type": "Prior Professional Experience",
        "period": "2024 (1 Year)",
        "tools": [
            "Talent Sourcing",
            "Interview Scheduling",
            "HR Documentation",
            "Candidate Coordination"
        ],
        "responsibilities": [
            "Managed recruitment coordination, talent sourcing, interview scheduling, and candidate documentation.",
            "Screened applicant profiles against specific cohort requirements, maintaining structured applicant tracking pipelines."
        ],
        "highlights": [
            "Managed recruitment, candidate scheduling, and documentation across 1 year of active talent acquisition operations.",
            "Streamlined interview scheduling workflows and maintained accurate candidate evaluation records."
        ]
    }
]

# 4. Leadership & Event Management (Front-loading the 5 Resume Roles)
data['leadership'] = [
    {
        "id": "lead-cchs-media",
        "title": "Event Head",
        "role_level": "Event Head",
        "organization": "CCHS MEDIA & Technical Team",
        "institution": "Centre for Counselling & Health Services (CCHS), CHRIST (Deemed to be University), Delhi NCR",
        "period": "2023 – 2025",
        "category": "Leadership & Event Management",
        "responsibilities": [
            "Led event operations and coordinated the overall management and technical teams.",
            "Delegated responsibilities and supported event planning, logistics and execution."
        ],
        "skills": [
            "Event Operations",
            "Technical Teams Coordination",
            "Overall Management",
            "Event Planning",
            "Logistics & Execution"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-placetrials",
        "title": "Core Team Member – Scholarship & Public Relations Head",
        "role_level": "Core Team Member & PR Head",
        "organization": "Placetrials 2026",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2025 – 2026",
        "category": "Leadership & Event Management",
        "responsibilities": [
            "Led scholarship-related coordination and public relations activities as part of the core organising team.",
            "Managed communications, promotional activities and stakeholder coordination."
        ],
        "skills": [
            "Public Relations",
            "Scholarship Coordination",
            "Stakeholder Management",
            "Promotional Communications",
            "Core Team Leadership"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-globalfest",
        "title": "Core Team Member – Overall Management",
        "role_level": "Core Team Member",
        "organization": "Global Fest 2.0",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2026",
        "year": 2026,
        "category": "Leadership & Event Management",
        "responsibilities": [
            "Coordinated teams, operational responsibilities and interdepartmental communication as part of the core management team.",
            "Supported event planning, logistics and on-ground execution."
        ],
        "skills": [
            "Overall Event Management",
            "Interdepartmental Communication",
            "Operational Coordination",
            "On-Ground Execution",
            "Logistics"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-nukkad-natak",
        "title": "Event Coordinator",
        "role_level": "Event Coordinator",
        "organization": "School of Sciences",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2024",
        "year": 2024,
        "category": "Cultural & Campus Engagement",
        "responsibilities": [
            "Coordinated the Nukkad Natak (street play) and other School of Sciences events.",
            "Supported participant coordination, logistics, planning and on-ground execution."
        ],
        "skills": [
            "Event Coordination",
            "Nukkad Natak (Street Play)",
            "Participant Coordination",
            "Logistics & Planning",
            "Campus Engagement"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-st-columba-pe",
        "title": "Head – Physical Education Department",
        "role_level": "Department Head",
        "organization": "St. Columba’s School, New Delhi",
        "institution": "St. Columba’s School, New Delhi",
        "period": "2021 – 2022",
        "category": "Leadership & Event Management",
        "responsibilities": [
            "Led student-level coordination for physical education activities, sports initiatives and school events.",
            "Demonstrated leadership, discipline, teamwork and organisational skills."
        ],
        "skills": [
            "Physical Education Coordination",
            "Sports Initiatives",
            "Student Leadership",
            "Teamwork & Discipline",
            "Organisational Skills"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-corporate-club-head",
        "title": "Corporate Club — Core Team Member & Overall Event Management Head",
        "role_level": "Core Team Member & Overall Event Management Head",
        "organization": "School of Sciences",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2026 – Present",
        "category": "Leadership & Event Management",
        "responsibilities": [
            "Serves as the executive head of overall event management for the School of Sciences Corporate Club, directing event planning, operational schedules, and execution teams.",
            "Leads student committee heads in coordinating industry corporate sessions, alumni speaker panels, and professional networking symposiums."
        ],
        "skills": [
            "Event Management",
            "Event Leadership",
            "Corporate Relations",
            "Team Leadership",
            "Operational Planning"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-advanced-peer",
        "title": "Advanced Peer Educator",
        "role_level": "Team Leader",
        "organization": "Centre for Counselling & Health Services (CCHS)",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2026 – 2028",
        "category": "Student Welfare & Peer Education",
        "responsibilities": [
            "Advanced peer leadership appointment following multi-year service as Peer Educator (2022–2025); mentors junior peer educators and coordinates wellness outreach programs.",
            "Assists CCHS professional staff in organizing university-wide student mental health awareness weeks, stress mitigation drives, and orientation bootcamps."
        ],
        "skills": [
            "Peer Mentoring",
            "Peer Education",
            "Student Well-being",
            "Health Awareness",
            "Interpersonal Communication"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-peer-educator",
        "title": "Peer Educator",
        "role_level": "Peer Educator",
        "organization": "Centre for Counselling & Health Services (CCHS)",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2022 – 2025",
        "category": "Student Welfare & Peer Education",
        "responsibilities": [
            "Completed structured peer education training under CCHS to support student orientation, well-being awareness, and healthy university community living.",
            "Facilitated peer-level wellness sessions, anti-stress initiatives, and community discussions; connected fellow students with official CCHS university counselling resources."
        ],
        "skills": [
            "Peer Education",
            "Peer Mentoring",
            "Student Well-being",
            "Health Awareness",
            "Active Listening"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-aparoksha-2023",
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
        "skills": [
            "Event Leadership",
            "Event Operations",
            "Programme Coordination",
            "Stakeholder Communication"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-aparoksha-2022",
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
        "skills": [
            "Event Execution",
            "Event Planning",
            "Volunteer Supervision",
            "Team Coordination"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-branding-media",
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
        "skills": [
            "Branding",
            "Digital Media",
            "Content Coordination",
            "Media Coordination"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-sdg-cell",
        "title": "SDG Cell — Member",
        "role_level": "Member",
        "organization": "School of Sciences",
        "institution": "CHRIST (Deemed to be University), Delhi NCR",
        "period": "2026 – Present",
        "category": "Sustainability & Institutional Engagement",
        "responsibilities": [
            "Contributes to United Nations Sustainable Development Goals (SDG) awareness campaigns, sustainability drives, and institutional campus initiatives.",
            "Organizes student awareness workshops focusing on sustainable tech practices and community environmental responsibility."
        ],
        "skills": [
            "Sustainable Development",
            "SDG Engagement",
            "Public Communication",
            "Team Collaboration"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-swo-literary",
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
        "skills": [
            "Student Welfare",
            "Literary Events",
            "Public Communication",
            "Creative Coordination"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    },
    {
        "id": "lead-disaster-mgmt",
        "title": "Disaster Management Team Member",
        "role_level": "Team Member",
        "organization": "St. Columba’s School, New Delhi",
        "institution": "St. Columba’s School, New Delhi",
        "period": "2020 – 2022",
        "category": "Disaster Management & Community Participation",
        "responsibilities": [
            "Participated in institutional safety preparedness protocols, evacuation drills, and campus emergency response simulations.",
            "Collaborated with faculty and student teams to promote safety awareness and rapid assistance protocols across secondary school cohorts."
        ],
        "skills": [
            "Disaster Preparedness",
            "Safety Awareness",
            "Emergency Response",
            "Team Collaboration"
        ],
        "verification_status": "Verified",
        "public_visibility": True
    }
]

# 5. Training & Certifications
data['certifications'] = [
    {
        "id": "cert-art-therapy",
        "name": "Art Therapy Programme",
        "issuer": "Centre for Counselling & Health Services (CCHS), CHRIST (Deemed to be University)",
        "year": "Verified",
        "description": "Structured mental health facilitation, creative expression, and student well-being under CCHS."
    },
    {
        "id": "cert-gatekeeper",
        "name": "Gatekeeper Training Programme",
        "issuer": "Centre for Counselling & Health Services (CCHS), CHRIST (Deemed to be University)",
        "year": "Verified",
        "description": "Certified suicide prevention, psychological first aid, and student distress identification protocol."
    },
    {
        "id": "cert-peer-educator",
        "name": "Certified Peer Educator",
        "issuer": "Centre for Counselling & Health Services (CCHS), CHRIST (Deemed to be University)",
        "year": "Verified",
        "description": "Peer mentorship recognition, student mental health awareness, and student community leadership."
    },
    {
        "id": "cert-swo-literary",
        "name": "SWO Art & Literary Club Member (2 Years)",
        "issuer": "Student Welfare Office (SWO), CHRIST (Deemed to be University)",
        "year": "Verified",
        "description": "Active participation in institutional literary events, debate moderation, and cultural fest coordination."
    },
    {
        "id": "cert-python",
        "name": "Python Programming Masterclass",
        "issuer": "Udemy",
        "year": "Verified",
        "description": "Comprehensive practical programming covering data structures, OOP, file I/O, and algorithmic problem solving."
    },
    {
        "id": "cert-msoffice",
        "name": "Microsoft Office Suite 2013 Certification",
        "issuer": "Microsoft / Certified Training",
        "year": "Verified",
        "description": "Advanced spreadsheet analysis, document automation, and executive presentation preparation."
    }
]

# 6. Education
data['education'] = [
    {
        "id": "edu-1",
        "degree": "Master of Computer Applications (MCA)",
        "institution": "CHRIST (Deemed to be University)",
        "location": "Delhi NCR, India",
        "period": "Currently pursuing",
        "details": "Pursuing Master of Computer Applications focusing on advanced computing, software engineering, and computational analysis.",
        "specialization": "Advanced Computing & Computational Analysis"
    },
    {
        "id": "edu-2",
        "degree": "Bachelor of Computer Applications (BCA)",
        "institution": "CHRIST (Deemed to be University)",
        "location": "Delhi NCR, India",
        "period": "2022–2025",
        "details": "Graduated with Specialization in Advanced Technological Skills. Coursework covered Data Structures, Database Systems, Computer Networks, and Web Technologies.",
        "specialization": "Advanced Technological Skills"
    },
    {
        "id": "edu-3",
        "degree": "Class XII – CBSE",
        "institution": "St. Columba’s School",
        "location": "New Delhi, India",
        "period": "Completed",
        "details": "Central Board of Secondary Education (CBSE). Focused on Computer Science and Mathematics with departmental leadership.",
        "specialization": "Computer Science & Mathematics"
    }
]

# Write to packages/shared/profile_data.json
with open('packages/shared/profile_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Write to apps/web/src/data/profile_data.json
with open('apps/web/src/data/profile_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("SUCCESS: Synced updated resume details to packages/shared and apps/web/src/data!")
print(f"Personal Name: {data['personal']['name']}")
print(f"Email: {data['personal']['email']}")
print(f"Experience Count: {len(data['experience'])}")
print(f"Leadership Count: {len(data['leadership'])}")
print(f"Certifications Count: {len(data['certifications'])}")
print(f"Education Count: {len(data['education'])}")

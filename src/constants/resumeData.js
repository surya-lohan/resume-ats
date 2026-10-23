export const SAMPLE_RESUME = {
    personalInfo: {
        fullName: 'Alex Morgan',
        email: 'alex.morgan@email.com',
        phone: '+1 (555) 382-9104',
        linkedin: 'linkedin.com/in/alexmorgan-dev',
        github: 'github.com/alexmorgan',
        description:
            'Results-driven Software Engineer with 3+ years of experience building high-throughput microservices and responsive web applications. Proven track record reducing API latency by 42% and architecting resilient distributed systems.',
    },
    education: [
        {
            college: 'University of California, Berkeley',
            degree: 'B.S. in Computer Science & Engineering',
            year: 'May 2024',
            cgpa: '3.85 / 4.0',
            location: 'Berkeley, CA',
        },
    ],
    experience: [
        {
            company: 'CloudScale Technologies',
            role: 'Software Engineer II',
            duration: 'Jun 2024 - Present',
            description:
                'Spearheaded migration of monolithic billing services to containerized Go microservices, boosting throughput by 35%.\nImplemented distributed Redis caching across 12 high-traffic API routes, slashing p99 latency from 450ms to 85ms.\nPartnered with cross-functional product and SRE teams to sustain 99.98% service uptime across 2M+ active sessions.',
        },
        {
            company: 'Nexis Digital Labs',
            role: 'Associate Frontend Developer',
            duration: 'Aug 2023 - May 2024',
            description:
                'Engineered performant, accessible React dashboard components utilizing Tailwind CSS and TypeScript, serving 150K monthly users.\nRefactored core state management to Zustand, decreasing redundant DOM re-renders by 28% and eliminating state race conditions.',
        },
    ],
    projects: [
        {
            name: 'PulseStream — Distributed Metrics Engine',
            tools: 'Go, Apache Kafka, React, TimescaleDB, Docker',
            duration: 'Jan 2024 - Apr 2024',
            description:
                'Architected real-time streaming pipeline ingesting 25,000 telemetry events per second with sub-50ms query responses.\nEngineered live interactive dashboard visualizations with React, WebSockets, and Tailwind CSS.',
        },
        {
            name: 'SmartParse — ATS Resume Optimizer',
            tools: 'React, Node.js, Express, Groq LLM API, PDF.js',
            duration: 'Nov 2023 - Dec 2023',
            description:
                'Built an intelligent resume parser evaluating keyword density and parsing rules against industry ATS rubric standards.\nAttained 94% parsing accuracy across 500+ heterogeneous resume layout templates.',
        },
    ],
    skills: [
        {
            name: 'Languages',
            value: 'TypeScript, JavaScript, Python, Go, SQL, HTML5/CSS3',
        },
        {
            name: 'Frameworks',
            value: 'React, Next.js, Node.js, Express, Tailwind CSS, Fastify',
        },
        {
            name: 'Tools',
            value: 'Docker, Kubernetes, AWS, PostgreSQL, Redis, Git, Kafka',
        },
    ],
    achievements:
        'Winner of CalHacks 10.0 out of 400+ participating engineering teams for building real-time latency optimizer.\nSelected among top 50 engineering fellows nationwide for the Cloud Architecture Fellowship (2024).',
    certifications:
        'AWS Certified Solutions Architect – Associate (Amazon Web Services, 2024)\nCertified Kubernetes Administrator (CKA) – Cloud Native Computing Foundation (2023)',
    showExperience: true,
    showProjects: true,
    showAchievements: true,
    showCertifications: true,
}

export const EMPTY_RESUME = {
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        description: '',
    },
    education: [{ college: '', degree: '', year: '', cgpa: '', location: '' }],
    experience: [{ company: '', role: '', description: '', duration: '' }],
    projects: [{ name: '', description: '', tools: '', duration: '' }],
    skills: [
        { name: 'Languages', value: '' },
        { name: 'Frameworks', value: '' },
        { name: 'Tools', value: '' },
    ],
    achievements: '',
    certifications: '',
    showExperience: true,
    showProjects: true,
    showAchievements: true,
    showCertifications: true,
}

export const normalizeSkills = (skills) => {
    if (!skills) {
        return [
            { name: 'Languages', value: '' },
            { name: 'Frameworks', value: '' },
            { name: 'Tools', value: '' },
        ]
    }

    if (Array.isArray(skills)) {
        if (skills.length === 0) {
            return [
                { name: 'Languages', value: '' },
                { name: 'Frameworks', value: '' },
                { name: 'Tools', value: '' },
            ]
        }

        // Check if items already adhere to { name/label/category/field, value/items/skills }
        const isStandardList = skills.every(
            (item) =>
                item &&
                typeof item === 'object' &&
                ('name' in item || 'label' in item || 'category' in item || 'field' in item)
        )

        if (isStandardList) {
            return skills.map((item) => ({
                name: (item.name ?? item.label ?? item.category ?? item.field ?? '').toString(),
                value: (item.value ?? item.skills ?? item.items ?? '').toString(),
            }))
        }

        // Legacy format: array containing one or more key-value objects
        // e.g. [{ Languages: '...', Frameworks: '...', Tools: '...' }]
        const converted = []
        for (const item of skills) {
            if (typeof item === 'string') {
                converted.push({ name: 'Skills', value: item })
            } else if (item && typeof item === 'object') {
                for (const [key, val] of Object.entries(item)) {
                    if (key === 'id' || key === '_id') continue
                    converted.push({
                        name: key,
                        value: Array.isArray(val) ? val.join(', ') : (val ?? '').toString(),
                    })
                }
            }
        }
        return converted.length > 0
            ? converted
            : [
                  { name: 'Languages', value: '' },
                  { name: 'Frameworks', value: '' },
                  { name: 'Tools', value: '' },
              ]
    }

    if (typeof skills === 'object') {
        const converted = []
        for (const [key, val] of Object.entries(skills)) {
            if (key === 'id' || key === '_id') continue
            converted.push({
                name: key,
                value: Array.isArray(val) ? val.join(', ') : (val ?? '').toString(),
            })
        }
        return converted.length > 0 ? converted : [{ name: 'Languages', value: '' }]
    }

    return [
        { name: 'Languages', value: '' },
        { name: 'Frameworks', value: '' },
        { name: 'Tools', value: '' },
    ]
}

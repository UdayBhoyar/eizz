/**
 * Eizz - Job Experience & Skill Parser Engine
 * Handles text extraction, experience matching, skill taxonomy classification, and section breakdown.
 */

(function (exports) {
  'use strict';

  // Comprehensive Skill Taxonomy dictionary
  const SKILL_TAXONOMY = {
    "Languages": [
      "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust", 
      "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML", "CSS", "R", "Scala", "Dart", "Elixir", "Bash", "Shell"
    ],
    "Frontend": [
      "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular", 
      "Svelte", "Tailwind", "Tailwind CSS", "Redux", "Zustand", "HTML5", "CSS3", "Webpack", 
      "Vite", "RxJS", "GraphQL", "REST API", "Responsive Design", "Microfrontends"
    ],
    "Backend & APIs": [
      "Node.js", "Express", "Express.js", "NestJS", "Django", "FastAPI", "Flask", 
      "Spring Boot", "Spring", "ASP.NET", ".NET Core", "Ruby on Rails", "Laravel", 
      "gRPC", "Microservices", "WebSockets", "Kafka", "RabbitMQ"
    ],
    "Cloud & DevOps": [
      "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", "Docker", 
      "Kubernetes", "K8s", "Terraform", "CI/CD", "GitHub Actions", "Jenkins", 
      "Ansible", "Serverless", "Cloudflare", "Helm", "Prometheus", "Grafana", "Linux"
    ],
    "Databases & Storage": [
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", 
      "Firebase", "Supabase", "Cassandra", "Snowflake", "Oracle", "SQLite", "Vector DB", "Pinecone"
    ],
    "AI / ML & Data": [
      "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "LLM", 
      "Large Language Models", "LangChain", "RAG", "NLP", "Machine Learning", 
      "Deep Learning", "Data Engineering", "Spark", "PySpark", "Airflow", "Hadoop"
    ],
    "Testing & Tools": [
      "Jest", "Cypress", "Playwright", "Selenium", "JUnit", "Mocha", "Chai", 
      "Git", "GitHub", "GitLab", "Jira", "Confluence", "Figma", "Postman", "Swagger"
    ],
    "Domain & Soft Skills": [
      "Agile", "Scrum", "Kanban", "System Design", "Software Architecture", 
      "Problem Solving", "Communication", "Leadership", "Mentorship", "Cross-functional", "Critical Thinking"
    ]
  };

  // Education keywords
  const EDUCATION_KEYWORDS = [
    { label: "Ph.D. / Doctorate", regex: /\b(ph\.?d|doctorate)\b/i },
    { label: "Master's Degree", regex: /\b(master'?s|m\.?s|m\.?tech|m\.?e|mba)\b/i },
    { label: "Bachelor's Degree", regex: /\b(bachelor'?s|b\.?s|b\.?tech|b\.?e|b\.?a)\b/i },
    { label: "Associate Degree", regex: /\b(associate'?s|associate degree)\b/i }
  ];

  /**
   * Main analyze function
   * @param {string} text - The job description raw text
   * @param {Array<string>} customSkills - Optional user-defined custom keywords to highlight
   */
  function analyzeJobDescription(text, customSkills = []) {
    if (!text || typeof text !== 'string') {
      return getEmptyAnalysis();
    }

    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    const experienceData = extractExperience(cleanText);
    const skillsData = extractSkills(cleanText, customSkills);
    const educationData = extractEducation(cleanText);
    const contextSentences = extractContextSentences(cleanText, experienceData.matches);

    return {
      experience: experienceData,
      skills: skillsData,
      education: educationData,
      contextSentences: contextSentences,
      totalWords: cleanText.split(' ').length
    };
  }

  /**
   * Extract Experience requirements
   */
  function extractExperience(text) {
    const experienceMatches = [];
    const yearRanges = [];

    // Regex 1: Explicit years range or minimum years
    // Examples: "3+ years", "5-7 years", "at least 2 years of experience", "minimum 4 yrs"
    const expRegexes = [
      /\b(?:at\s+least|minimum|min\.?|up\s+to|over|more\s+than)?\s*(\d{1,2})\s*(?:\+|–|-|to)\s*(\d{1,2})?\s*(?:years?|yrs?)\b(?:\s+(?:of\s+)?(?:relevant\s+)?experience)?/gi,
      /\b(\d{1,2})\s*\+\s*(?:years?|yrs?)\b(?:\s+(?:of\s+)?(?:relevant\s+)?experience)?/gi,
      /\b(?:experience\s*:\s*|experience\s+of\s+)?(\d{1,2})\s*(?:years?|yrs?)\b/gi,
      /\b(entry[- ]level|freshers?|junior|mid[- ]senior|senior|lead|principal|director|internship)\b(?:\s+level)?/gi
    ];

    expRegexes.forEach((regex) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        const fullMatchStr = match[0].trim();
        if (!experienceMatches.includes(fullMatchStr)) {
          experienceMatches.push(fullMatchStr);
        }

        // Extract numbers if present
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        if (!isNaN(num1)) {
          yearRanges.push(num1);
        }
        if (!isNaN(num2)) {
          yearRanges.push(num2);
        }
      }
    });

    // Summary calculation
    let minYears = 0;
    let maxYears = 0;
    let summaryText = "Not Specified";
    let levelText = "Mid Level";

    if (yearRanges.length > 0) {
      minYears = Math.min(...yearRanges);
      maxYears = Math.max(...yearRanges);
      if (minYears === maxYears) {
        summaryText = `${minYears}+ Years`;
      } else {
        summaryText = `${minYears} - ${maxYears} Years`;
      }
    } else {
      // Check level hints
      const lower = text.toLowerCase();
      if (lower.includes('fresher') || lower.includes('entry level') || lower.includes('internship')) {
        summaryText = "0 - 1 Years";
        levelText = "Entry Level";
      } else if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal')) {
        summaryText = "5+ Years (Senior)";
        levelText = "Senior Level";
      }
    }

    const lowerText = text.toLowerCase();
    if (minYears >= 5 || maxYears >= 5 || lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('principal')) {
      levelText = "Senior Level";
    } else if (minYears >= 2 || maxYears >= 3 || lowerText.includes('mid-level') || lowerText.includes('intermediate')) {
      levelText = "Mid Level";
    } else if (yearRanges.length > 0 || lowerText.includes('fresher') || lowerText.includes('entry level') || lowerText.includes('junior')) {
      levelText = "Entry / Junior";
    }

    return {
      summary: summaryText,
      minYears: minYears,
      maxYears: maxYears,
      levelTag: levelText,
      matches: experienceMatches
    };
  }

  /**
   * Extract Skills matching predefined taxonomy + custom user keywords
   */
  function extractSkills(text, customSkills = []) {
    const foundSkillsByCategory = {};
    const allFoundSkills = new Set();
    const customMatches = [];

    // Helper to test keyword in text using word boundaries
    function findMatches(keyword) {
      // Escape special characters like C++, .NET, C#
      const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // For skills with +, # or dots, adjust word boundary
      let regexStr = `\\b${escaped}\\b`;
      if (/[+#.]/.test(keyword)) {
        regexStr = `(?:^|\\s|\\(|,)${escaped}(?:$|\\s|\\)|,|\\.)`;
      }

      const regex = new RegExp(regexStr, 'gi');
      const matches = text.match(regex);
      return matches ? matches.length : 0;
    }

    // Iterate taxonomy
    for (const [category, skillsList] of Object.entries(SKILL_TAXONOMY)) {
      foundSkillsByCategory[category] = [];
      skillsList.forEach((skill) => {
        const count = findMatches(skill);
        if (count > 0) {
          foundSkillsByCategory[category].push({
            name: skill,
            count: count
          });
          allFoundSkills.add(skill);
        }
      });
    }

    // Check Custom User Skills
    if (Array.isArray(customSkills)) {
      customSkills.forEach((skill) => {
        if (!skill || typeof skill !== 'string') return;
        const count = findMatches(skill);
        if (count > 0) {
          customMatches.push({ name: skill, count: count });
          allFoundSkills.add(skill);
        }
      });
    }

    // Convert category map into clean array
    const categories = [];
    for (const [catName, skills] of Object.entries(foundSkillsByCategory)) {
      if (skills.length > 0) {
        categories.push({
          category: catName,
          skills: skills.sort((a, b) => b.count - a.count)
        });
      }
    }

    return {
      totalUniqueCount: allFoundSkills.size,
      categories: categories,
      customMatches: customMatches,
      flatList: Array.from(allFoundSkills)
    };
  }

  /**
   * Extract Education Requirements
   */
  function extractEducation(text) {
    const found = [];
    EDUCATION_KEYWORDS.forEach((edu) => {
      if (edu.regex.test(text)) {
        found.push(edu.label);
      }
    });
    return found.length > 0 ? found : ["Degree / Equivalent Experience"];
  }

  /**
   * Extract Key Context Sentences mentioning Experience or Requirements
   */
  function extractContextSentences(text, expMatches) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const relevant = [];

    sentences.forEach((sentence) => {
      const lower = sentence.toLowerCase();
      const hasExp = expMatches.some(m => sentence.includes(m)) || 
                     /experience|years|yrs|required|qualifications|must have/i.test(sentence);
      
      if (hasExp && sentence.length > 15 && sentence.length < 250) {
        const clean = sentence.trim();
        if (!relevant.includes(clean)) {
          relevant.push(clean);
        }
      }
    });

    return relevant.slice(0, 4); // Top 4 key context sentences
  }

  function getEmptyAnalysis() {
    return {
      experience: { summary: "Not Specified", minYears: 0, maxYears: 0, levelTag: "Unknown", matches: [] },
      skills: { totalUniqueCount: 0, categories: [], customMatches: [], flatList: [] },
      education: [],
      contextSentences: [],
      totalWords: 0
    };
  }

  // Export for node or browser window environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { analyzeJobDescription, SKILL_TAXONOMY };
  } else {
    exports.EizzParser = { analyzeJobDescription, SKILL_TAXONOMY };
  }
})(typeof window !== 'undefined' ? window : this);

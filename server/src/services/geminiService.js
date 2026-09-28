const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate Career Analysis using Gemini AI with fallback capability.
 */
const generateCareerAnalysis = async (profileData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are an expert AI Career Gap Recovery Advisor specializing in helping women transition back into professional careers or higher education after taking a career break.

Analyze this candidate profile:
- Name: ${profileData.name || 'Candidate'}
- Previous Role: ${profileData.previousRole || ''}
- Education: ${profileData.education || ''}
- Years of Experience: ${profileData.experience || profileData.yearsOfExperience || 0} years
- Previous Industry: ${profileData.industry || profileData.previousIndustry || ''}
- Career Break Duration: ${profileData.careerBreak || profileData.breakDuration || ''}
- Previous Skills: ${Array.isArray(profileData.skills || profileData.previousSkills) ? (profileData.skills || profileData.previousSkills).join(', ') : (profileData.skills || profileData.previousSkills || '')}
- Interests: ${Array.isArray(profileData.interests) ? profileData.interests.join(', ') : profileData.interests || ''}
- Preferred Work Type: ${profileData.workType || profileData.preferredWorkType || 'Remote'}
- Preferred Location: ${profileData.location || profileData.preferredLocation || 'Flexible'}
- Desired Career / Target Role: ${profileData.desiredCareer || ''}

Return ONLY valid JSON matching this exact structure:
{
  "transferableSkills": [
    { "skill": "string", "relevance": "string", "category": "Soft Skill | Tech Skill | Leadership | Management" }
  ],
  "existingStrengths": ["string"],
  "skillGaps": [
    { "skill": "string", "priority": "High | Medium | Low", "recommendedAction": "string" }
  ],
  "recommendedCareerPaths": [
    {
      "roleTitle": "string",
      "matchPercentage": 90,
      "rationale": "string",
      "expectedSalaryRange": "string",
      "growthPotential": "High | Medium"
    }
  ],
  "recommendedCourses": [
    { "title": "string", "platform": "Coursera | Udemy | LinkedIn Learning | SheBack Academy", "duration": "string", "focusArea": "string", "difficulty": "Beginner | Intermediate" }
  ],
  "recommendedInternships": [
    { "title": "string", "company": "string", "workType": "Remote | Hybrid | On-site", "stipend": "string", "description": "string" }
  ],
  "recommendedJobs": [
    { "title": "string", "company": "string", "workType": "Remote | Hybrid | On-site", "salary": "string", "reason": "string" }
  ],
  "personalizedRoadmap": [
    {
      "phaseNumber": 1,
      "title": "Phase 1: Foundation & Skill Refresh",
      "duration": "Weeks 1-4",
      "description": "string",
      "milestones": [
        { "title": "string", "type": "skill | course | project | networking | application", "link": "string" }
      ]
    },
    {
      "phaseNumber": 2,
      "title": "Phase 2: Project Portfolio & Hands-on Practice",
      "duration": "Weeks 5-8",
      "description": "string",
      "milestones": [
        { "title": "string", "type": "skill | course | project | networking | application", "link": "string" }
      ]
    },
    {
      "phaseNumber": 3,
      "title": "Phase 3: Network Reactivation & Returnship Applications",
      "duration": "Weeks 9-12",
      "description": "string",
      "milestones": [
        { "title": "string", "type": "skill | course | project | networking | application", "link": "string" }
      ]
    }
  ]
}
`;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean markdown code fencing
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      if (parsed.transferableSkills && parsed.skillGaps) {
        return parsed;
      }
    } catch (error) {
      console.warn('[Gemini AI] Call failed or key error, using smart generator:', error.message);
    }
  }

  return generateDynamicFallback(profileData);
};

const generateDynamicFallback = (profile) => {
  const desired = profile.desiredCareer || profile.previousRole || 'Career Specialist';
  const rawSkills = profile.skills || profile.previousSkills || [];
  const prevSkills = Array.isArray(rawSkills) && rawSkills.length > 0 
    ? rawSkills 
    : ['Project Planning', 'Cross-Functional Communication', 'Problem Solving', 'Data Analysis'];

  return {
    transferableSkills: [
      { skill: prevSkills[0] || 'Leadership & Planning', relevance: `Directly applies to responsibilities in ${desired}.`, category: 'Management' },
      { skill: prevSkills[1] || 'Cross-Functional Collaboration', relevance: 'Crucial for modern agile teams and remote setups.', category: 'Soft Skill' },
      { skill: prevSkills[2] || 'Analytical Thinking', relevance: 'Helps in decision making and workflow execution.', category: 'Tech Skill' },
      { skill: 'Adaptability & Resilience', relevance: 'Reflects maturity and navigating professional transition after career hiatus.', category: 'Soft Skill' },
    ],
    existingStrengths: [
      `${profile.experience || profile.yearsOfExperience || 3}+ years of industry foundation in ${profile.industry || profile.previousIndustry || 'Professional Services'}`,
      `Solid groundwork in ${prevSkills.slice(0, 2).join(' & ')}`,
      `Strong commitment to re-skilling into ${desired}`,
      `Proven experience with business workflows and communication`
    ],
    skillGaps: [
      { skill: `Modern ${desired} Tools & Frameworks`, priority: 'High', recommendedAction: 'Complete a 4-week certified refresher course' },
      { skill: 'AI-Assisted Workplace Productivity (Gemini, Copilot)', priority: 'Medium', recommendedAction: 'Practice prompt engineering and workflow automation' },
      { skill: 'Recent Industry Case Studies & Portfolio', priority: 'High', recommendedAction: 'Build 2 hands-on capstone projects tailored for returnships' },
      { skill: 'Personal Brand & Profile Optimization', priority: 'Medium', recommendedAction: 'Update bio highlighting career hiatus strengths & certifications' }
    ],
    recommendedCareerPaths: [
      {
        roleTitle: desired,
        matchPercentage: 92,
        rationale: `Your experience as a ${profile.previousRole || 'professional'} paired with intentional re-skilling provides a competitive edge for ${desired}.`,
        expectedSalaryRange: '₹8 - ₹16 LPA / $75k - $110k',
        growthPotential: 'High'
      },
      {
        roleTitle: `Associate ${desired}`,
        matchPercentage: 88,
        rationale: 'An accelerated entry path allowing on-the-job refresher training and quick career progression.',
        expectedSalaryRange: '₹6 - ₹12 LPA / $65k - $90k',
        growthPotential: 'High'
      },
      {
        roleTitle: 'Returnship Specialist',
        matchPercentage: 85,
        rationale: 'Direct placement in returnee-focused fellowship programs with dedicated mentorship.',
        expectedSalaryRange: 'Competitive Stipend to Full-time',
        growthPotential: 'High'
      }
    ],
    recommendedCourses: [
      { title: `${desired} Modern Refresher`, platform: 'SheBack Academy', duration: '6 Weeks', focusArea: 'Core competencies & tools', difficulty: 'Intermediate' },
      { title: 'Generative AI & Data Analytics for Professionals', platform: 'Coursera / Google', duration: '4 Weeks', focusArea: 'AI-driven workflow modernization', difficulty: 'Beginner' }
    ],
    recommendedInternships: [
      { title: `${desired} Returnship Fellow`, company: 'TechReturn Partners', workType: profile.workType || 'Remote', stipend: 'Paid Returnship', description: 'Structured 16-week re-entry program with senior mentorship and conversion opportunities.' }
    ],
    recommendedJobs: [
      { title: `${desired}`, company: 'Flexible Innovations', workType: profile.workType || 'Remote', salary: 'Competitive', reason: 'Explicit returner-friendly hiring policy with flexible schedules.' }
    ],
    personalizedRoadmap: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Foundation & Skill Refresh',
        duration: 'Weeks 1-4',
        description: 'Rebuild core skills and align with current industry standards.',
        milestones: [
          { title: 'Complete AI-assisted skills audit', type: 'skill', link: '/analysis' },
          { title: 'Enroll in 1 domain refresher bridge course', type: 'course', link: '/opportunities' },
          { title: 'Position career break affirmatively on resume & LinkedIn', type: 'networking', link: '/profile' }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Project Portfolio & Hands-on Practice',
        duration: 'Weeks 5-8',
        description: 'Build modern proof-of-work to showcase recent capabilities.',
        milestones: [
          { title: 'Build 1 practical portfolio project using modern tools', type: 'project', link: '#' },
          { title: 'Attend SheBack returnee peer mentoring session', type: 'networking', link: '#' }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Applications & Returnships',
        duration: 'Weeks 9-12',
        description: 'Begin targeted applications for returnships and remote roles.',
        milestones: [
          { title: 'Apply to 3 verified return-to-work programs', type: 'application', link: '/opportunities' },
          { title: 'Complete mock interview with returnee alumni', type: 'networking', link: '#' }
        ]
      }
    ]
  };
};

module.exports = {
  generateCareerAnalysis,
  generateDynamicFallback,
};

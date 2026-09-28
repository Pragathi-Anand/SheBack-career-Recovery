const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate Career Analysis using Gemini AI with fallback capability.
 */
const generateCareerAnalysis = async (profileData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
You are an expert AI Career Gap Recovery Advisor specializing in helping women transition back into full-time, part-time, or remote professional careers after taking a career break (parenting, elder care, illness, education, personal hiatus).

Analyze the following candidate profile carefully:
- Name: ${profileData.name}
- Previous Role: ${profileData.previousRole}
- Education: ${profileData.education}
- Years of Experience: ${profileData.yearsOfExperience} years
- Previous Industry: ${profileData.previousIndustry}
- Career Break Duration: ${profileData.breakDuration}
- Previous Skills: ${Array.isArray(profileData.previousSkills) ? profileData.previousSkills.join(', ') : profileData.previousSkills}
- Interests: ${Array.isArray(profileData.interests) ? profileData.interests.join(', ') : profileData.interests}
- Preferred Work Type: ${profileData.preferredWorkType}
- Preferred Location: ${profileData.preferredLocation}
- Desired Career / Target Role: ${profileData.desiredCareer}

Return ONLY a valid JSON object (without markdown code blocks, backticks, or raw formatting around the JSON) matching EXACTLY this JSON structure:
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
    { "title": "string", "company": "string", "workType": "Remote | Hybrid | On-site", "location": "string", "salary": "string", "reason": "string" }
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

      // Clean markdown fencing if returned
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      console.warn('[Gemini AI] API call failed or key invalid, fallback to smart generator:', error.message);
    }
  }

  // Dynamic Rule-Based Smart Fallback Generator tailored to profileData
  return generateDynamicFallback(profileData);
};

const generateDynamicFallback = (profile) => {
  const desired = profile.desiredCareer || profile.previousRole || 'Tech Specialist';
  const prevSkills = Array.isArray(profile.previousSkills) && profile.previousSkills.length > 0 
    ? profile.previousSkills 
    : ['Project Management', 'Problem Solving', 'Communication', 'Data Analysis'];

  return {
    transferableSkills: [
      { skill: prevSkills[0] || 'Leadership & Planning', relevance: `Directly applies to standard responsibilities in ${desired}.`, category: 'Management' },
      { skill: prevSkills[1] || 'Cross-Functional Collaboration', relevance: 'Crucial for modern agile teams and remote setups.', category: 'Soft Skill' },
      { skill: prevSkills[2] || 'Analytical Thinking', relevance: 'Helps in decision making and data-driven project execution.', category: 'Tech Skill' },
      { skill: 'Adaptability & Resilience', relevance: 'Reflects maturity, handling transitions, and navigating change after career break.', category: 'Soft Skill' },
    ],
    existingStrengths: [
      `${profile.yearsOfExperience || 3}+ years of industry foundation in ${profile.previousIndustry || 'Professional Services'}`,
      `Solid groundwork in ${prevSkills.slice(0, 2).join(' & ')}`,
      `Strong commitment to re-skilling into ${desired}`,
      `Proven experience with business workflows and communication`
    ],
    skillGaps: [
      { skill: `Modern ${desired} Tools & Frameworks`, priority: 'High', recommendedAction: 'Complete a 4-week certified refresher course' },
      { skill: 'AI-Assisted Workflow Tools (ChatGPT, Copilot, Notion AI)', priority: 'Medium', recommendedAction: 'Practice prompt engineering and automated workflows' },
      { skill: 'Recent Industry Case Studies & Portfolio', priority: 'High', recommendedAction: 'Build 2 hands-on capstone projects tailored for returnships' },
      { skill: 'LinkedIn & Personal Brand Optimization', priority: 'Medium', recommendedAction: 'Update bio highlighting break achievements & fresh certifications' }
    ],
    recommendedCareerPaths: [
      {
        roleTitle: desired,
        matchPercentage: 92,
        rationale: `Your experience as a ${profile.previousRole} paired with your break reset gives you a unique strategic edge for ${desired}.`,
        expectedSalaryRange: '$75,000 - $110,000 / year',
        growthPotential: 'High'
      },
      {
        roleTitle: `Senior ${desired} Lead`,
        matchPercentage: 85,
        rationale: `Leveraging your total ${profile.yearsOfExperience} years of domain knowledge for higher tier coordination.`,
        expectedSalaryRange: '$90,000 - $130,000 / year',
        growthPotential: 'High'
      },
      {
        roleTitle: 'Product Operations / Program Specialist',
        matchPercentage: 80,
        rationale: 'Ideal bridge role for returning professionals with strong multi-tasking skills.',
        expectedSalaryRange: '$70,000 - $95,000 / year',
        growthPotential: 'Medium'
      }
    ],
    recommendedCourses: [
      { title: `${desired} Modern Masterclass 2026`, platform: 'SheBack Academy', duration: '4 Weeks', focusArea: 'Core Concepts & Hands-on Tools', difficulty: 'Beginner' },
      { title: 'AI & Productivity Tools for Career Returnees', platform: 'Coursera', duration: '2 Weeks', focusArea: 'Generative AI & Automation', difficulty: 'Beginner' },
      { title: 'Project Management & Agile Operations', platform: 'LinkedIn Learning', duration: '3 Weeks', focusArea: 'Scrum, Jira & Remote Team Management', difficulty: 'Intermediate' }
    ],
    recommendedInternships: [
      { title: `${desired} Returnship Fellow`, company: 'InnovateHer Tech', workType: profile.preferredWorkType || 'Remote', stipend: '$2,500 / month', description: 'Structured 12-week paid returnship designed specifically for women returning after a career hiatus with mentorship support.' },
      { title: 'Operations & Strategy Associate', company: 'Global Women Network', workType: 'Hybrid', stipend: '$2,200 / month', description: 'Part-time return-to-work program with full 1-on-1 career coaching.' }
    ],
    recommendedJobs: [
      { title: `${desired} - Flexible / Return-to-Work`, company: 'EmpowerTech Corp', workType: profile.preferredWorkType || 'Remote', location: profile.preferredLocation || 'Remote', salary: '$85,000 / year', reason: 'Explicit returnship friendly policy & flexible hours.' },
      { title: `Associate ${desired}`, company: 'Apex Solutions', workType: 'Remote', location: 'Flexible', salary: '$78,000 / year', reason: 'High match with your previous skill base.' }
    ],
    personalizedRoadmap: [
      {
        phaseNumber: 1,
        title: 'Phase 1: Foundation & Skill Refresh',
        duration: 'Weeks 1-4',
        description: 'Rebuild core technical/domain competencies and set up your updated resume & portfolio.',
        milestones: [
          { title: `Complete ${desired} Masterclass`, type: 'course', link: '/opportunities' },
          { title: 'Audit transferable skills and write updated bio', type: 'skill', link: '/profile' },
          { title: 'Set up GitHub / Portfolio Website', type: 'project', link: '#' }
        ]
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Practical Projects & Confidence Building',
        duration: 'Weeks 5-8',
        description: 'Create real-world capstone projects to showcase current hands-on capability.',
        milestones: [
          { title: 'Build 1 major capstone project addressing modern industry problems', type: 'project', link: '#' },
          { title: 'Participate in a SheBack peer hackathon / sprint', type: 'networking', link: '#' },
          { title: 'Conduct 3 informational interviews with women leaders', type: 'networking', link: '#' }
        ]
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Returnships & Direct Job Search',
        duration: 'Weeks 9-12',
        description: 'Apply to curated returnships, interview with supportive partners, and secure placement.',
        milestones: [
          { title: 'Submit 5 tailored returnship applications', type: 'application', link: '/opportunities' },
          { title: 'Practice mock behavioral interviews highlighting break lessons', type: 'networking', link: '#' },
          { title: 'Finalize compensation negotiation strategy', type: 'skill', link: '#' }
        ]
      }
    ]
  };
};

module.exports = { generateCareerAnalysis, generateDynamicFallback };

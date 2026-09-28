const Opportunity = require('../models/Opportunity');

const sampleOpportunities = [
  // COURSES
  {
    _id: 'opp_c1',
    title: 'Full-Stack Web Development Returner Bootcamp',
    company: 'SheBack Academy & Meta',
    type: 'course',
    description: 'Comprehensive 8-week refresher on React, Node.js, REST APIs, and modern web application deployment tailored for returning engineers.',
    location: 'Online / Self-Paced',
    workType: 'Remote',
    requiredSkills: ['JavaScript', 'HTML/CSS', 'React', 'Git'],
    url: 'https://coursera.org',
    targetRoles: ['Full Stack Developer', 'Frontend Engineer', 'Web Developer'],
    experienceLevel: 'Intermediate',
    duration: '8 Weeks',
    stipendOrSalary: 'Free / Scholarship Eligible',
    rating: 4.9,
    isReturnship: true,
  },
  {
    _id: 'opp_c2',
    title: 'AI & Data Analytics Returnship Prep',
    company: 'Google Cloud & Women in AI',
    type: 'course',
    description: 'Learn modern Python data analysis, SQL, and Google Gemini AI integration to jumpstart a data career after a hiatus.',
    location: 'Online',
    workType: 'Remote',
    requiredSkills: ['Python', 'SQL', 'Data Visualization', 'AI Fundamentals'],
    url: 'https://grow.google',
    targetRoles: ['Data Analyst', 'AI Specialist', 'Business Intelligence Analyst'],
    experienceLevel: 'Beginner to Intermediate',
    duration: '6 Weeks',
    stipendOrSalary: 'Free Access',
    rating: 4.8,
    isReturnship: true,
  },
  {
    _id: 'opp_c3',
    title: 'Agile Product Management & Scrum Master Certification',
    company: 'Scrum Alliance',
    type: 'course',
    description: 'Master product backlogs, sprint planning, Jira, and cross-functional team coordination.',
    location: 'Virtual Workshop',
    workType: 'Remote',
    requiredSkills: ['Agile', 'Scrum', 'Product Management', 'Jira'],
    url: 'https://scrumalliance.org',
    targetRoles: ['Product Manager', 'Scrum Master', 'Project Manager'],
    experienceLevel: 'All Levels',
    duration: '4 Weeks',
    stipendOrSalary: '$199 (50% Discount for Returnees)',
    rating: 4.7,
    isReturnship: false,
  },

  // INTERNSHIPS / RETURNSHIPS
  {
    _id: 'opp_i1',
    title: 'Software Engineering Returnship Fellow',
    company: 'Goldman Sachs & TechReturners',
    type: 'internship',
    description: '16-week paid returnship offering dedicated 1-on-1 mentorship, technical refresher training, and direct path to full-time engineering roles.',
    location: 'New York, NY / Hybrid',
    workType: 'Hybrid',
    requiredSkills: ['Java', 'Python', 'React', 'Problem Solving'],
    url: 'https://goldmansachs.com/careers',
    targetRoles: ['Software Engineer', 'Backend Developer', 'Full Stack Developer'],
    experienceLevel: '2+ Years Prior Experience',
    duration: '16 Weeks',
    stipendOrSalary: '$3,500 / month',
    rating: 4.9,
    isReturnship: true,
  },
  {
    _id: 'opp_i2',
    title: 'Product Design (UX/UI) Returnship Program',
    company: 'Adobe',
    type: 'internship',
    description: 'Designed specifically for design professionals returning after 1+ years gap. Focuses on Figma, design systems, and user research.',
    location: 'San Francisco, CA / Remote',
    workType: 'Remote',
    requiredSkills: ['Figma', 'User Research', 'Wireframing', 'UI Design'],
    url: 'https://adobe.com/careers',
    targetRoles: ['UX/UI Designer', 'Product Designer'],
    experienceLevel: '1+ Years Prior Experience',
    duration: '12 Weeks',
    stipendOrSalary: '$3,200 / month',
    rating: 4.9,
    isReturnship: true,
  },
  {
    _id: 'opp_i3',
    title: 'Digital Marketing & Content Strategy Fellow',
    company: 'HubSpot',
    type: 'internship',
    description: 'Paid 12-week fellowship for marketing specialists re-entering the workforce. Flexible working hours.',
    location: 'Boston, MA / Remote',
    workType: 'Remote',
    requiredSkills: ['SEO', 'Content Strategy', 'HubSpot', 'Social Media Analytics'],
    url: 'https://hubspot.com/careers',
    targetRoles: ['Digital Marketer', 'Content Strategist', 'SEO Manager'],
    experienceLevel: 'All Levels',
    duration: '12 Weeks',
    stipendOrSalary: '$2,800 / month',
    rating: 4.8,
    isReturnship: true,
  },

  // JOBS
  {
    _id: 'opp_j1',
    title: 'Frontend React Developer (Return-to-Work Friendly)',
    company: 'EmpowerHer Solutions',
    type: 'job',
    description: 'Flexible hybrid/remote role building user interfaces for healthcare tech. Dedicated onboarding buddy provided for career gap returnees.',
    location: 'Austin, TX / Remote',
    workType: 'Remote',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'REST API'],
    url: 'https://empowerher.io/jobs',
    targetRoles: ['Frontend Engineer', 'React Developer'],
    experienceLevel: 'Mid-Level',
    duration: 'Permanent Full-Time',
    stipendOrSalary: '$85,000 - $105,000 / year',
    rating: 4.9,
    isReturnship: false,
  },
  {
    _id: 'opp_j2',
    title: 'Project Coordinator (Flexible Part-Time Option)',
    company: 'Salesforce',
    type: 'job',
    description: 'Collaborate with enterprise teams to manage milestones, documentation, and stakeholder communications.',
    location: 'Chicago, IL / Hybrid',
    workType: 'Hybrid',
    requiredSkills: ['Project Management', 'Communication', 'Asana', 'Excel'],
    url: 'https://salesforce.com/careers',
    targetRoles: ['Project Coordinator', 'Program Associate', 'Project Manager'],
    experienceLevel: 'Entry-Mid Level',
    duration: 'Permanent Part-Time / Full-Time',
    stipendOrSalary: '$65,000 - $80,000 / year',
    rating: 4.8,
    isReturnship: false,
  },
  {
    _id: 'opp_j3',
    title: 'Junior Data Analyst',
    company: 'Stripe',
    type: 'job',
    description: 'Analyze user behavior data, build dashboard metrics, and collaborate with business leads. Welcoming applications with career breaks.',
    location: 'Seattle, WA / Remote',
    workType: 'Remote',
    requiredSkills: ['SQL', 'Tableau', 'Python', 'Excel'],
    url: 'https://stripe.com/jobs',
    targetRoles: ['Data Analyst', 'Business Analyst'],
    experienceLevel: 'Junior / Mid',
    duration: 'Permanent Full-Time',
    stipendOrSalary: '$90,000 - $115,000 / year',
    rating: 5.0,
    isReturnship: false,
  }
];

const { getOpportunities: getStoredOpportunities, saveState } = require('../services/storeService');

const getOpportunities = async (req, res) => {
  try {
    const { type, search, workType } = req.query;

    let filter = {};
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (workType && workType !== 'all') {
      filter.workType = workType;
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { organization: searchRegex },
        { description: searchRegex },
        { requiredSkills: searchRegex },
        { skills: searchRegex },
      ];
    }

    // 1. Try Primary MongoDB
    try {
      const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
      if (opportunities.length > 0) {
        return res.json({ success: true, count: opportunities.length, opportunities });
      }
    } catch (dbErr) {
      // MongoDB query failed, fall through to in-memory/disk store
    }

    // 2. Fallback to combined stored opportunities and sampleOpportunities
    const storedOpps = getStoredOpportunities();
    const combinedOpps = [...storedOpps, ...sampleOpportunities];

    // Deduplicate by _id or title
    const seen = new Set();
    const uniqueOpps = [];
    for (const opp of combinedOpps) {
      const key = String(opp._id || opp.title);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueOpps.push(opp);
      }
    }

    let results = uniqueOpps;
    if (type && type !== 'all') {
      results = results.filter((o) => o.type === type);
    }
    if (workType && workType !== 'all') {
      results = results.filter((o) => o.workType === workType);
    }
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(
        (o) =>
          o.title?.toLowerCase().includes(s) ||
          o.company?.toLowerCase().includes(s) ||
          o.organization?.toLowerCase().includes(s) ||
          o.description?.toLowerCase().includes(s) ||
          (o.requiredSkills || o.skills || []).some((sk) => sk.toLowerCase().includes(s))
      );
    }

    return res.json({ success: true, count: results.length, opportunities: results });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const { title, company, organization, type, description, skills, requiredSkills, location, workType, experience, experienceLevel, url, URL } = req.body;

    const orgName = organization || company;
    if (!title || !orgName || !type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required opportunity fields: title, organization/company, type, and description are required.',
      });
    }

    const validTypes = ['course', 'internship', 'job'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid opportunity type. Must be one of: ${validTypes.join(', ')}`,
      });
    }

    const rawSkills = skills || requiredSkills || [];
    const formattedSkills = Array.isArray(rawSkills)
      ? rawSkills
      : typeof rawSkills === 'string'
      ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const oppData = {
      title,
      organization: orgName,
      company: orgName,
      type,
      description,
      skills: formattedSkills,
      requiredSkills: formattedSkills,
      location: location || 'Remote',
      workType: workType || 'Remote',
      experience: experience || experienceLevel || 'Intermediate',
      experienceLevel: experience || experienceLevel || 'Intermediate',
      URL: URL || url || '#',
      url: URL || url || '#',
      createdAt: new Date().toISOString(),
    };

    let createdOpp = null;

    // 1. Try Primary MongoDB
    try {
      createdOpp = await Opportunity.create(oppData);
    } catch (dbErr) {
      console.warn('[CreateOpportunity] MongoDB insert error:', dbErr.message);
    }

    // 2. Always persist into local disk store
    const storedOpps = getStoredOpportunities();
    const fallbackId = 'opp_' + Date.now();
    const finalOpp = {
      _id: createdOpp?._id ? String(createdOpp._id) : fallbackId,
      ...oppData,
    };
    storedOpps.unshift(finalOpp);
    saveState();

    return res.status(201).json({
      success: true,
      message: 'Opportunity successfully created',
      opportunity: createdOpp || finalOpp,
    });
  } catch (err) {
    console.error('Create opportunity error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating opportunity.' });
  }
};

module.exports = { getOpportunities, createOpportunity, sampleOpportunities };

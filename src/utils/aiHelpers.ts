import { Section } from '../contexts/ResumeContext';

// This is a mock implementation for demonstration purposes
// In a real application, this would connect to an actual AI service
export const getAIImprovement = async (text: string, fieldType: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (!text || text.trim() === '') {
    return text;
  }
  
  // Simple enhancement logic based on field type
  switch (fieldType) {
    case 'summary':
      return enhanceSummary(text);
    case 'description':
      return enhanceDescription(text);
    case 'highlights':
      return enhanceHighlights(text);
    default:
      return text;
  }
};

export const getContentFeedback = async (section: Section, content: string): Promise<{ score: number; feedback: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock scoring and feedback
  const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
  
  let feedback = '';
  if (score < 70) {
    feedback = 'This content needs significant improvement. Consider adding more specifics and achievements.';
  } else if (score < 85) {
    feedback = 'Good content, but could be enhanced with more specific metrics and accomplishments.';
  } else {
    feedback = 'Excellent content! It effectively communicates your experience and achievements.';
  }
  
  return { score, feedback };
};

// Helper functions for specific enhancements
function enhanceSummary(text: string): string {
  // Mock AI enhancement for summaries
  if (text.length < 100) {
    return text + ' Skilled in cross-functional collaboration and delivering high-quality solutions in fast-paced environments.';
  }
  
  // Replace generic terms with more impactful ones
  return text
    .replace(/experienced/gi, 'accomplished')
    .replace(/good/gi, 'exceptional')
    .replace(/worked on/gi, 'spearheaded')
    .replace(/helped/gi, 'led');
}

function enhanceDescription(text: string): string {
  // Mock AI enhancement for job descriptions
  if (text.length < 50) {
    return text + ' Collaborated with cross-functional teams to deliver high-impact solutions that increased efficiency and user satisfaction.';
  }
  
  // Replace generic terms with more impactful ones
  return text
    .replace(/responsible for/gi, 'led')
    .replace(/worked with/gi, 'collaborated with')
    .replace(/made/gi, 'created')
    .replace(/improved/gi, 'optimized');
}

function enhanceHighlights(text: string): string {
  // Mock AI enhancement for job highlights
  const bullets = text.split('\n').filter(line => line.trim() !== '');
  
  // Enhanced bullets with action verbs and metrics
  const enhancedBullets = bullets.map(bullet => {
    // If the bullet already starts with an action verb, just enhance it slightly
    if (/^(Led|Developed|Created|Managed|Implemented)/i.test(bullet)) {
      return bullet.replace(/improved/gi, 'increased').replace(/by \d+%/gi, 'by 35%');
    }
    
    // Otherwise, add an action verb
    const actionVerbs = ['Spearheaded', 'Orchestrated', 'Pioneered', 'Transformed', 'Revitalized'];
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    
    return `${randomVerb} ${bullet.charAt(0).toLowerCase() + bullet.slice(1)}`;
  });
  
  // Add an additional achievement-focused bullet if there are few bullets
  if (bullets.length < 3) {
    enhancedBullets.push('Increased team productivity by 25% through implementation of streamlined workflows and enhanced collaboration tools');
  }
  
  return enhancedBullets.join('\n');
}
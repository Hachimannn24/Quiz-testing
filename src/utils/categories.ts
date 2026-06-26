import { CategoryDetails } from '../types';

export const getCategoryDetails = (category: string): CategoryDetails => {
  const norm = category.toLowerCase();
  
  if (norm.includes('web') || norm.includes('dev') || norm.includes('code') || norm.includes('programming')) {
    return {
      name: 'Web Development',
      iconName: 'Code',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-100',
      description: 'HTML/CSS, JavaScript, React, browser engines, APIs'
    };
  }
  
  if (norm.includes('science') || norm.includes('nature') || norm.includes('space') || norm.includes('biology') || norm.includes('physics')) {
    return {
      name: 'Science & Nature',
      iconName: 'Atom',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-100',
      description: 'Astronomy, biology, chemistry, quantum physics'
    };
  }
  
  if (norm.includes('history') || norm.includes('ancient') || norm.includes('war') || norm.includes('era')) {
    return {
      name: 'History',
      iconName: 'Compass',
      color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-100',
      description: 'Pivotal discoveries, ancient empires, global events'
    };
  }
  
  if (norm.includes('pop') || norm.includes('culture') || norm.includes('movie') || norm.includes('music') || norm.includes('game')) {
    return {
      name: 'Pop Culture',
      iconName: 'Film',
      color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',
      textColor: 'text-pink-700',
      borderColor: 'border-pink-100',
      description: 'Movies, hit music, video games, current entertainment'
    };
  }
  
  if (norm.includes('general') || norm.includes('trivia') || norm.includes('knowledge')) {
    return {
      name: 'General Knowledge',
      iconName: 'Brain',
      color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-100',
      description: 'Fascinating global trivia, geography, word facts'
    };
  }
  
  // Custom fallback
  return {
    name: category,
    iconName: 'PenTool',
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-100',
    description: 'Custom community created quiz'
  };
};

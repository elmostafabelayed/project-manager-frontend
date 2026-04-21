export const categories = [
  'Design & creative',
  'Developpement & tech',
  'AI & emerging tech',
  'Marketing',
  'Writing & content',
  'Admin & support'
];

export const categoryMapping = {
  'Design & creative': { slug: 'design', label: 'Design & Creative' },
  'Developpement & tech': { slug: 'development', label: 'Development & Tech' },
  'AI & emerging tech': { slug: 'ai', label: 'AI & Emerging Tech' },
  'Marketing': { slug: 'marketing', label: 'Marketing' },
  'Writing & content': { slug: 'writing', label: 'Writing & Content' },
  'Admin & support': { slug: 'admin', label: 'Admin & Support' }
};

export const getCategoryInfo = (category) => {
  return categoryMapping[category] || { slug: 'default', label: category || 'General' };
};

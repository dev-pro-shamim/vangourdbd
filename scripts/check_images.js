const fs = require('fs');
const path = require('path');

const files = [
  '.cms-data/sections.json',
  '.cms-data/products.json',
  '.cms-data/categories.json',
  '.cms-data/settings.json',
  'src/data/cmsDefaults.ts'
];

files.forEach(file => {
  const fullPath = path.resolve(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const matches = content.match(/https?:\/\/[^\s"'`]+(?:\.jpg|\.png|\.webp|\.jpeg)/g) || [];
    console.log(file, 'has', matches.length, 'external image URLs');
    if (matches.length > 0) {
      console.log('Sample:', matches.slice(0, 3));
    }
  }
});

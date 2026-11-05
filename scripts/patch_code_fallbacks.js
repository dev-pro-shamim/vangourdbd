const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Patch src/data/cmsDefaults.ts
const cmsDefaultsPath = path.join(rootDir, 'src/data/cmsDefaults.ts');
let defaultsContent = fs.readFileSync(cmsDefaultsPath, 'utf8');

defaultsContent = defaultsContent
  .replaceAll('https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg', '/assets/banner/VuASK1790148496-light-4348x1613.jpeg')
  .replaceAll('https://commandobd.com/uploads/all/2024/09/24/slider-2.jpg', '/assets/banner/TAPFJ1784980888-dark-4348x1613.jpeg')
  .replaceAll('https://commandobd.com/uploads/all/2024/09/24/slider-3.jpg', '/assets/banner/lbx2U1780402785-dark-1915x709.jpg')
  .replaceAll('/assets/products/e4E8L1790170889.jpeg', '/assets/products/1tIg71784619728-light-690x966.jpg');

fs.writeFileSync(cmsDefaultsPath, defaultsContent, 'utf8');
console.log('Patched src/data/cmsDefaults.ts!');

// 2. Patch other files referencing e4E8L1790170889
const filesToPatch = [
  'src/app/admin/products/page.tsx',
  'src/app/category/[slug]/page.tsx',
  'src/app/product/[slug]/page.tsx',
  'src/app/shop/page.tsx',
  'src/components/home/ProductSliderSection.tsx'
];

filesToPatch.forEach(rel => {
  const p = path.join(rootDir, rel);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    if (content.includes('e4E8L1790170889')) {
      content = content.replaceAll('/assets/products/e4E8L1790170889.jpeg', '/assets/products/1tIg71784619728-light-690x966.jpg');
      fs.writeFileSync(p, content, 'utf8');
      console.log('Patched:', rel);
    }
  }
});

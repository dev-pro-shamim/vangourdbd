const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// 1. Repair .cms-data/products.json
const productsFile = path.join(rootDir, '.cms-data/products.json');
if (fs.existsSync(productsFile)) {
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
  let fixedCount = 0;
  
  // Available verified local product images
  const fallbackList = [
    '/assets/products/1tIg71784619728-light-690x966.jpg',
    '/assets/products/38bb31784794944-light-690x966.jpg',
    '/assets/products/b5zDi1787037850-light-1500x2100.jpg',
    '/assets/products/SAa2b1785410492-light-690x966.jpg',
    '/assets/products/sUNTL1784801696-light-690x966.jpg',
    '/assets/products/tbiAZ1785409747-light-690x966.jpg',
    '/assets/products/7HNKp1789976155-light-4464x6250.jpg',
    '/assets/products/u4yoI1787549976-light-1463x2048.jpg',
    '/assets/products/3veBh1789454191-light-2902x4064.webp',
  ];

  products.forEach((p, idx) => {
    // Check main image
    let img = p.image;
    let images = Array.isArray(p.images) ? [...p.images] : [];

    // Filter out invalid or non-existent URLs from images
    images = images.filter(url => {
      if (!url) return false;
      if (url.includes('commandobd.com')) return false;
      if (url.startsWith('/')) {
        const localPath = path.join(publicDir, url);
        return fs.existsSync(localPath);
      }
      return true;
    });

    if (!img || img.includes('commandobd.com') || (img.startsWith('/') && !fs.existsSync(path.join(publicDir, img)))) {
      if (images.length > 0) {
        img = images[0];
      } else {
        img = fallbackList[idx % fallbackList.length];
        images = [img];
      }
      fixedCount++;
    }

    if (images.length === 0) {
      images = [img];
    } else if (!images.includes(img)) {
      images.unshift(img);
    }

    p.image = img;
    p.images = images;
  });

  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Repaired ${fixedCount} products in .cms-data/products.json! Total products: ${products.length}`);
}

// 2. Repair .cms-data/sections.json
const sectionsFile = path.join(rootDir, '.cms-data/sections.json');
if (fs.existsSync(sectionsFile)) {
  const sections = JSON.parse(fs.readFileSync(sectionsFile, 'utf8'));
  const heroSec = sections.find(s => s.type === 'hero_slider');
  if (heroSec && heroSec.data) {
    heroSec.data.slides = [
      {
        id: "slide-1",
        desktopImage: "/assets/banner/VuASK1790148496-light-4348x1613.jpeg",
        mobileImage: "/assets/banner/M93eh1790150699-light-1686x1800.jpg",
        title: "VANGUARD TACTICAL DROP",
        subtitle: "EXPLORE YOUR FASHION",
        buttonText: "Shop Collection",
        buttonLink: "/category/New-Arrivals",
        hasBrandOverlay: false,
        isEnabled: true
      },
      {
        id: "slide-2",
        desktopImage: "/assets/banner/TAPFJ1784980888-dark-4348x1613.jpeg",
        mobileImage: "/assets/banner/21vgD1784981320-dark-1101x1321.jpeg",
        title: "Best Selling Half Shirts",
        subtitle: "Premium lightweight summer fabrics",
        buttonText: "Explore Shirts",
        buttonLink: "/category/Best-selling-Half-Shirts-2",
        hasBrandOverlay: false,
        isEnabled: true
      },
      {
        id: "slide-3",
        desktopImage: "/assets/banner/lbx2U1780402785-dark-1915x709.jpg",
        mobileImage: "/assets/banner/nMofP1790167547-light-1500x2100.jpg",
        title: "Signature Denim 2026",
        subtitle: "Bring your denim back to life",
        buttonText: "Discover Denim",
        buttonLink: "/category/denim",
        hasBrandOverlay: false,
        isEnabled: true
      }
    ];
  }

  // Check video banner and bento grid
  const videoSec = sections.find(s => s.type === 'video_banner');
  if (videoSec && videoSec.data) {
    videoSec.data.posterImage = "/assets/banner/gZMsL1785584381-2002x1037.jpg";
  }

  const bentoSec = sections.find(s => s.type === 'bento_grid');
  if (bentoSec && bentoSec.data && bentoSec.data.bentoItems) {
    bentoSec.data.bentoItems = [
      {
        id: "bi-1",
        title: "TACTICAL PANTS",
        subtitle: "Engineered for utility",
        image: "/assets/category/hn8ac1780476447.jpg",
        link: "/category/denim",
        size: "large"
      },
      {
        id: "bi-2",
        title: "PREMIUM CAPS",
        subtitle: "Tactical headwear",
        image: "/assets/category/dVZuG1780476419.jpg",
        link: "/category/New-Arrivals",
        size: "medium"
      },
      {
        id: "bi-3",
        title: "SIGNATURE POLO",
        subtitle: "Classic fit & breathability",
        image: "/assets/category/A7Lq51780476457.jpg",
        link: "/category/Best-selling-Half-Shirts-2",
        size: "medium"
      }
    ];
  }

  fs.writeFileSync(sectionsFile, JSON.stringify(sections, null, 2), 'utf8');
  console.log('Repaired .cms-data/sections.json with verified local banner and category assets!');
}

// 3. Repair .cms-data/categories.json
const catFile = path.join(rootDir, '.cms-data/categories.json');
if (fs.existsSync(catFile)) {
  const categories = JSON.parse(fs.readFileSync(catFile, 'utf8'));
  const catFallbacks = [
    '/assets/category/hn8ac1780476447.jpg',
    '/assets/category/dVZuG1780476419.jpg',
    '/assets/category/A7Lq51780476457.jpg',
  ];
  let catFixed = 0;
  categories.forEach((c, idx) => {
    if (!c.image || c.image.includes('commandobd.com') || (c.image.startsWith('/') && !fs.existsSync(path.join(publicDir, c.image)))) {
      c.image = catFallbacks[idx % catFallbacks.length];
      catFixed++;
    }
  });
  fs.writeFileSync(catFile, JSON.stringify(categories, null, 2), 'utf8');
  console.log(`Repaired ${catFixed} categories in .cms-data/categories.json!`);
}

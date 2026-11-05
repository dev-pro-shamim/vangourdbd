export interface BannerItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  link: string;
  buttonText?: string;
}

export const HERO_BANNERS: BannerItem[] = [
  {
    id: 1,
    title: "NEW ARRIVALS 2026",
    subtitle: "TACTICAL & CASUAL STREETWEAR",
    image: "/assets/banner/VuASK1790148496-light-4348x1613.jpeg",
    link: "/category/New-Arrivals",
    buttonText: "SHOP NOW"
  },
  {
    id: 2,
    title: "PREMIUM SUMMER DROP",
    subtitle: "SIGNATURE TEES & HALF SHIRTS",
    image: "/assets/banner/TAPFJ1784980888-dark-4348x1613.jpeg",
    link: "/category/Best-selling-Half-Shirts-2",
    buttonText: "EXPLORE"
  },
  {
    id: 3,
    title: "TACTICAL ESSENTIALS",
    subtitle: "ENGINEERED FOR SUPREME UTILITY",
    image: "/assets/banner/lbx2U1780402785-dark-1915x709.jpg",
    link: "/category/denim",
    buttonText: "DISCOVER"
  }
];

export const PROMO_BANNERS = [
  {
    id: 1,
    title: "Gentlemen's Polo",
    image: "/assets/banner/OxByZ1785564423-1726x1854.jpg",
    link: "/category/polo-shirt"
  },
  {
    id: 2,
    title: "Denim Revamped",
    image: "/assets/banner/l2EBs1785564443-1980x1854.jpg",
    link: "/category/denim"
  },
  {
    id: 3,
    title: "Tactical Cargo & Pants",
    image: "/assets/banner/wfNI31785564455-1726x1854.jpg",
    link: "/category/pant"
  }
];

export const BENTO_BANNERS = [
  {
    id: 1,
    title: "Activewear & Vests",
    image: "/assets/banner/Dsr1I1785564499-2001x2069.jpg",
    link: "/category/vest",
    gridClass: "col-span-1 md:col-span-1 row-span-2"
  },
  {
    id: 2,
    title: "Tactical Shorts",
    image: "/assets/banner/gZMsL1785584381-2002x1037.jpg",
    link: "/category/shorts",
    gridClass: "col-span-1 md:col-span-2 row-span-1"
  },
  {
    id: 3,
    title: "Signature Accessories",
    image: "/assets/banner/R6slD1785564518-2001x2069.jpg",
    link: "/category/cap",
    gridClass: "col-span-1 md:col-span-1 row-span-1"
  },
  {
    id: 4,
    title: "Urban Movement",
    image: "/assets/banner/nrmQW1785571630-1726x1854.jpg",
    link: "/category/JOGGERS",
    gridClass: "col-span-1 md:col-span-1 row-span-1"
  }
];

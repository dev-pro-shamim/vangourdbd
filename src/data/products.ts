export interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  remoteImage: string;
  category: string;
  categorySlug: string;
  isStockOut: boolean;
  badge: string;
  discount: string;
  sizes: string[];
  colors: string[];
  sku: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    "id": 1,
    "slug": "two-quater-black-27118",
    "title": "Two Quater (Black) 27118",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/DCQSi1789462944-light-2590x3625.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/DCQSi1789462944-light-2590x3625.webp",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1000",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 2,
    "slug": "commando-acid-wash-vest-light-khaki-28068",
    "title": "Commando Acid Wash Vest Light Khaki- 28068",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/SAa2b1785410492-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/SAa2b1785410492-light-690x966.jpg",
    "category": "Vest",
    "categorySlug": "vest",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1001",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 3,
    "slug": "tactical-inner-shorts-khaki-27099",
    "title": "Tactical Inner Shorts (Khaki) 27099",
    "price": 1509,
    "originalPrice": 1688,
    "image": "/assets/products/b5zDi1787037850-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/b5zDi1787037850-light-1500x2100.jpg",
    "category": "Shorts",
    "categorySlug": "shorts",
    "isStockOut": true,
    "badge": "11% OFF",
    "discount": "11",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1002",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 4,
    "slug": "commando-tactical-vest-grey-28052",
    "title": "Commando Tactical Vest Grey- 28052",
    "price": 890,
    "originalPrice": 1113,
    "image": "/assets/products/e8YOr1785394015-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/e8YOr1785394015-light-690x966.jpg",
    "category": "Vest",
    "categorySlug": "vest",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#808080"
    ],
    "sku": "CMD-1003",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 5,
    "slug": "tactical-vest-brown-28053",
    "title": "Commando Tactical Vest Brown- 28053",
    "price": 890,
    "originalPrice": 890,
    "image": "/assets/products/FXES21785395270-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/FXES21785395270-light-690x966.jpg",
    "category": "Vest",
    "categorySlug": "vest",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#654321"
    ],
    "sku": "CMD-1004",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 6,
    "slug": "commando-tactical-vest-white-28054",
    "title": "Commando Tactical Vest White- 28054",
    "price": 890,
    "originalPrice": 1113,
    "image": "/assets/products/GJOZw1785403147-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/GJOZw1785403147-light-690x966.jpg",
    "category": "Vest",
    "categorySlug": "vest",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#f8f8f8"
    ],
    "sku": "CMD-1005",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 7,
    "slug": "two-quater-green-27109",
    "title": "Two Quater (Green) 27109",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/WJXQM1789453796-light-2857x4000.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/WJXQM1789453796-light-2857x4000.webp",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#556b2f"
    ],
    "sku": "CMD-1006",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 8,
    "slug": "shorts-inner-shorts-navy-27065",
    "title": "Shorts Inner Shorts (Navy) 27065",
    "price": 1390,
    "originalPrice": 1738,
    "image": "/assets/products/l1IDR1787037505-dark-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/l1IDR1787037505-dark-690x966.png",
    "category": "Shorts",
    "categorySlug": "shorts",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1007",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 9,
    "slug": "two-quater-light-olive-27113",
    "title": "Two Quater (Light Olive) 27113",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/v00eP1789463305-light-2527x3537.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/v00eP1789463305-light-2527x3537.webp",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#556b2f"
    ],
    "sku": "CMD-1008",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 10,
    "slug": "commando-acid-wash-vest-beige-28067",
    "title": "Commando Acid Wash Vest Beige- 28067",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/tbiAZ1785409747-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/tbiAZ1785409747-light-690x966.jpg",
    "category": "Vest",
    "categorySlug": "vest",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1009",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 11,
    "slug": "baggy-denim-dk-blue-55018",
    "title": "Baggy Denim (Dk Blue) 55018",
    "price": 1192,
    "originalPrice": 1690,
    "image": "/assets/products/iEoiF1787552095-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/iEoiF1787552095-light-690x966.png",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "29% OFF",
    "discount": "29",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1010",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 12,
    "slug": "cargo-chinos-slim-fit-six-pocket-with-chain-53003",
    "title": "Cargo Chinos Slim fit six Pocket with chain -53003",
    "price": 1672,
    "originalPrice": 2090,
    "image": "/assets/products/CuaJU1787493449-dark-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/CuaJU1787493449-dark-690x966.png",
    "category": "Pant",
    "categorySlug": "pant",
    "isStockOut": true,
    "badge": "20% OFF",
    "discount": "20",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1011",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 13,
    "slug": "premium-bootcut-denim-vintage-wash-blue-51003",
    "title": "Premium Bootcut Denim (Vintage Wash Blue)– 51003",
    "price": 1690,
    "originalPrice": 2113,
    "image": "/assets/products/d0rY21784616228-light-690x966.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/d0rY21784616228-light-690x966.webp",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1012",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 14,
    "slug": "bootcut-denim-stonewash-blue-51009",
    "title": "Bootcut Denim (Stonewash Blue) – 51009",
    "price": 1690,
    "originalPrice": 2113,
    "image": "/assets/products/1tIg71784619728-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/1tIg71784619728-light-690x966.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1013",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 15,
    "slug": "bootcut-denim-jeans-dirty-yellow-wash-51010",
    "title": "Bootcut Denim Jeans (Dirty Yellow Wash)– 51010",
    "price": 1790,
    "originalPrice": 1990,
    "image": "/assets/products/CAVgh1784620745-light-690x966.jpeg",
    "remoteImage": "https://back-office.commandobd.com/productImages/CAVgh1784620745-light-690x966.jpeg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "10% OFF",
    "discount": "10",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1014",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 16,
    "slug": "slim-fit-cargo-denim-acid-wash-blue-52011",
    "title": "Slim Fit Cargo Denim (Acid Wash Blue)– 52011",
    "price": 2290,
    "originalPrice": 2863,
    "image": "/assets/products/38bb31784794944-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/38bb31784794944-light-690x966.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1015",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 17,
    "slug": "denim-pant-commando-baggy-fit-55004",
    "title": "Denim Pant - Commando Baggy Fit - 55004",
    "price": 1620,
    "originalPrice": 2025,
    "image": "/assets/products/FBAE61789643368-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/FBAE61789643368-light-690x966.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1016",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 18,
    "slug": "baggy-denim-light-acid-55001",
    "title": "Baggy Denim (Light Acid) 55001",
    "price": 1192,
    "originalPrice": 1690,
    "image": "/assets/products/SnaFc1787551190-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/SnaFc1787551190-light-690x966.png",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "29% OFF",
    "discount": "29",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1017",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 19,
    "slug": "baggy-denim-dk-blue-55005",
    "title": "Baggy Denim (Dk Blue) 55005",
    "price": 1620,
    "originalPrice": 2025,
    "image": "/assets/products/KM5Hm1787553868-light-1463x2048.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/KM5Hm1787553868-light-1463x2048.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1018",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 20,
    "slug": "straight-fit-cargo-denim-pant-54005",
    "title": "Straight Fit Cargo Denim (Ice Blue Wash)– 54005",
    "price": 2490,
    "originalPrice": 3113,
    "image": "/assets/products/sUNTL1784801696-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/sUNTL1784801696-light-690x966.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1019",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 21,
    "slug": "denim-pant-baggy-fit-55002",
    "title": "Denim Pant - Baggy Fit - 55002",
    "price": 1192,
    "originalPrice": 1690,
    "image": "/assets/products/vtvUM1787550925-light-1463x2048.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/vtvUM1787550925-light-1463x2048.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "29% OFF",
    "discount": "29",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1020",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 22,
    "slug": "denim-pant-baggy-fit-55003",
    "title": "Denim Pant - Baggy Fit - 55003",
    "price": 1192,
    "originalPrice": 1690,
    "image": "/assets/products/u4yoI1787549976-light-1463x2048.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/u4yoI1787549976-light-1463x2048.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "29% OFF",
    "discount": "29",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1021",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 23,
    "slug": "straight-fit-denim-pant-54010",
    "title": "Straight Fit Denim Pant - 54010",
    "price": 1672,
    "originalPrice": 2090,
    "image": "/assets/products/Wrirz1787494436-light-1371x1920.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/Wrirz1787494436-light-1371x1920.jpg",
    "category": "Denim Pant",
    "categorySlug": "denim",
    "isStockOut": true,
    "badge": "20% OFF",
    "discount": "20",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1022",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 24,
    "slug": "commando-cargo-chinos-slim-fit-six-pocket-54006",
    "title": "Commando Cargo Chinos Slim Fit Six Pocket - 54006",
    "price": 1790,
    "originalPrice": 1990,
    "image": "/assets/products/8uNTT1787494199-dark-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/8uNTT1787494199-dark-690x966.png",
    "category": "Pant",
    "categorySlug": "pant",
    "isStockOut": true,
    "badge": "10% OFF",
    "discount": "10",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1023",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 25,
    "slug": "OS. Washed Tactical Polo (Dark Nevy) - 36241",
    "title": "OS. Washed Tactical Polo (Dark Nevy) - 36241",
    "price": 1790,
    "originalPrice": 2238,
    "image": "/assets/products/bzyUA1790509415-light-4464x6250.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/bzyUA1790509415-light-4464x6250.jpg",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "0",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1024",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 26,
    "slug": "os-washed-tactical-polo-36240-dark-grey",
    "title": "OS. Washed Tactical Polo - 36240 (Dark Grey)",
    "price": 1790,
    "originalPrice": 2238,
    "image": "/assets/products/IfpZz1790499201-light-4464x6250.jpeg",
    "remoteImage": "https://back-office.commandobd.com/productImages/IfpZz1790499201-light-4464x6250.jpeg",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "0",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#808080"
    ],
    "sku": "CMD-1025",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 27,
    "slug": "polo-shirt-blue-36223-2",
    "title": "Polo Shirt (Blue) 36223",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/Cusmt1787635711-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/Cusmt1787635711-light-690x966.jpg",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1026",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 28,
    "slug": "regular-fit-polo-36025",
    "title": "Regular Fit Polo - 36025",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/1rE6I1787579794-light-731x1024.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/1rE6I1787579794-light-731x1024.png",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1027",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 29,
    "slug": "polo-shirt-lt-khaki-36026",
    "title": "Polo Shirt (Lt Khaki) 36026",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/m894c1787579611-light-731x1024.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/m894c1787579611-light-731x1024.png",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1028",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 30,
    "slug": "reguler-fit-polo-36022",
    "title": "Reguler Fit Polo - 36022",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/6iCJj1787579314-light-731x1024.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/6iCJj1787579314-light-731x1024.png",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1029",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 31,
    "slug": "high-neck-polo-shirt-black-36209",
    "title": "High Neck Polo Shirt (Black) 36209",
    "price": 1490,
    "originalPrice": 1863,
    "image": "/assets/products/hlWA51787578677-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/hlWA51787578677-light-690x966.png",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1030",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 32,
    "slug": "high-neck-polo-shirt-olive-36210",
    "title": "High Neck Polo Shirt (Olive) 36210",
    "price": 1490,
    "originalPrice": 1863,
    "image": "/assets/products/xaTkf1787578482-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/xaTkf1787578482-light-690x966.png",
    "category": "Polo Shirt",
    "categorySlug": "polo-shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#556b2f"
    ],
    "sku": "CMD-1031",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 33,
    "slug": "two-quater-blue-27115",
    "title": "Two Quater (Blue) 27115",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/bH5eR1789463178-light-2501x3502.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/bH5eR1789463178-light-2501x3502.webp",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1032",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 34,
    "slug": "two-quater-charcoal-27111",
    "title": "Two Quater (Charcoal) 27111",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/3veBh1789454191-light-2902x4064.webp",
    "remoteImage": "https://back-office.commandobd.com/productImages/3veBh1789454191-light-2902x4064.webp",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1033",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 35,
    "slug": "tactical-inner-shorts-black-27097",
    "title": "Tactical Inner Shorts (Black) 27097",
    "price": 1509,
    "originalPrice": 1688,
    "image": "/assets/products/yJi5M1787722545-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/yJi5M1787722545-light-690x966.jpg",
    "category": "Shorts",
    "categorySlug": "shorts",
    "isStockOut": true,
    "badge": "11% OFF",
    "discount": "11",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1034",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 36,
    "slug": "two-quarter-anthra-27057",
    "title": "Two Quarter (Anthra) 27057",
    "price": 1030,
    "originalPrice": 1290,
    "image": "/assets/products/ajjJY1787511819-dark-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/ajjJY1787511819-dark-690x966.png",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "20% OFF",
    "discount": "20",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1035",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 37,
    "slug": "tactica-inner-shorts-olive-27098",
    "title": "Tactica Inner Shorts (Olive) 27098",
    "price": 1509,
    "originalPrice": 1688,
    "image": "/assets/products/G0w2J1787037773-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/G0w2J1787037773-light-690x966.jpg",
    "category": "Shorts",
    "categorySlug": "shorts",
    "isStockOut": true,
    "badge": "11% OFF",
    "discount": "11",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#556b2f"
    ],
    "sku": "CMD-1036",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 38,
    "slug": "tactical-inner-shorts-maroon-27096",
    "title": "Tactical Inner Shorts (Maroon) 27096",
    "price": 1509,
    "originalPrice": 1688,
    "image": "/assets/products/RiLHV1784296165-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/RiLHV1784296165-light-690x966.jpg",
    "category": "Shorts",
    "categorySlug": "shorts",
    "isStockOut": true,
    "badge": "11% OFF",
    "discount": "11",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1037",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 39,
    "slug": "long-sleeveless-gown-black-30003",
    "title": "Long Sleeveless Gown (Black) 30003",
    "price": 1690,
    "originalPrice": 2113,
    "image": "/assets/products/hC9Jj1790679147-light-4464x6250.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/hC9Jj1790679147-light-4464x6250.jpg",
    "category": "Woman's Wear",
    "categorySlug": "Woman's-Wear",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1038",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 40,
    "slug": "ladies-long-tops-off-white-40004",
    "title": "Ladies Long Tops (Off White) - 40004",
    "price": 1790,
    "originalPrice": 2238,
    "image": "/assets/products/ENkc51790503384-light-4464x6250.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/ENkc51790503384-light-4464x6250.jpg",
    "category": "Woman's Wear",
    "categorySlug": "Woman's-Wear",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "0",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#f8f8f8"
    ],
    "sku": "CMD-1039",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 41,
    "slug": "oversized-hoodie-jacket-37020",
    "title": "Oversized Hoodie Jacket 37020",
    "price": 3090,
    "originalPrice": 3863,
    "image": "/assets/products/r3nBT1790060393-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/r3nBT1790060393-light-1500x2100.jpg",
    "category": "Hoodie",
    "categorySlug": "hoodie",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1040",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 42,
    "slug": "panjabi-black-41294",
    "title": "Panjabi (Black) 41294",
    "price": 4750,
    "originalPrice": 5938,
    "image": "/assets/products/qDgEW1789648508-light-690x965.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/qDgEW1789648508-light-690x965.jpg",
    "category": "Panjabi",
    "categorySlug": "Panjabi",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1041",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 43,
    "slug": "hoodie-sweat-shirt-red-37063",
    "title": "Hoodie Sweat Shirt (Red) 37063",
    "price": 1990,
    "originalPrice": 2488,
    "image": "/assets/products/GsjeC1790061147-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/GsjeC1790061147-light-1500x2100.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#b22222"
    ],
    "sku": "CMD-1042",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 44,
    "slug": "sweat-shirt-brown-25075",
    "title": "Sweat Shirt (Brown) 25075",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/BQTHG1790056569-light-1463x2048.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/BQTHG1790056569-light-1463x2048.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#654321"
    ],
    "sku": "CMD-1043",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 45,
    "slug": "sweat-shirt-khaki-25072",
    "title": "Sweat Shirt (Khaki) 25072",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/ffOsD1790056501-light-1463x2048.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/ffOsD1790056501-light-1463x2048.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1044",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 46,
    "slug": "regular-fit-jacket-off-white-24112",
    "title": "Regular Fit Jacket (Off White) 24112",
    "price": 2890,
    "originalPrice": 3613,
    "image": "/assets/products/UTTRG1790061433-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/UTTRG1790061433-light-1500x2100.jpg",
    "category": "Jacket",
    "categorySlug": "Jacket",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#f8f8f8"
    ],
    "sku": "CMD-1045",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 47,
    "slug": "regular-fit-jacket-white-24114",
    "title": "Regular Fit Jacket (White) 24114",
    "price": 2890,
    "originalPrice": 3613,
    "image": "/assets/products/suJk51790061476-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/suJk51790061476-light-1500x2100.jpg",
    "category": "Jacket",
    "categorySlug": "Jacket",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#f8f8f8"
    ],
    "sku": "CMD-1046",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 48,
    "slug": "oversized-hoodie-black-37031",
    "title": "Oversized Hoodie (Black) 37031",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/WP3Io1789989165-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/WP3Io1789989165-light-690x966.jpg",
    "category": "Hoodie",
    "categorySlug": "hoodie",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1047",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 49,
    "slug": "oversized-hoodie-lt-khaki-37038",
    "title": "Oversized Hoodie (Lt Khaki) 37038",
    "price": 1590,
    "originalPrice": 1988,
    "image": "/assets/products/E8Kpi1789988939-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/E8Kpi1789988939-light-690x966.jpg",
    "category": "Hoodie",
    "categorySlug": "hoodie",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1048",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 50,
    "slug": "ladies-high-neck-tops-bottle-green-40110",
    "title": "Ladies High Neck Tops (Bottle Green) - 40110",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/7HNKp1789976155-light-4464x6250.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/7HNKp1789976155-light-4464x6250.jpg",
    "category": "Woman's Wear",
    "categorySlug": "Woman's-Wear",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#556b2f"
    ],
    "sku": "CMD-1049",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 51,
    "slug": "panjabi-lt-khaki-41293",
    "title": "Panjabi (Lt Khaki) 41293",
    "price": 4750,
    "originalPrice": 5938,
    "image": "/assets/products/EtA291789647849-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/EtA291789647849-light-690x966.jpg",
    "category": "Panjabi",
    "categorySlug": "Panjabi",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#c3b091",
      "#8b7d6b"
    ],
    "sku": "CMD-1050",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 52,
    "slug": "zipper-hoodie-37016",
    "title": "Zipper Hoodie 37016",
    "price": 1850,
    "originalPrice": 2313,
    "image": "/assets/products/EWyaQ1789890594-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/EWyaQ1789890594-light-690x966.png",
    "category": "Hoodie",
    "categorySlug": "hoodie",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1051",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 53,
    "slug": "ladies-high-neck-tops-dark-brown-40108",
    "title": "Ladies High Neck Tops (Dark Brown) - 40108",
    "price": 1290,
    "originalPrice": 1613,
    "image": "/assets/products/s6aEg1789975814-light-4464x6250.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/s6aEg1789975814-light-4464x6250.jpg",
    "category": "Woman's Wear",
    "categorySlug": "Woman's-Wear",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#654321"
    ],
    "sku": "CMD-1052",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 54,
    "slug": "zipper-hoodie-37012",
    "title": "Zipper Hoodie 37012",
    "price": 1890,
    "originalPrice": 2363,
    "image": "/assets/products/wPDxM1789988259-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/wPDxM1789988259-light-690x966.png",
    "category": "Hoodie",
    "categorySlug": "hoodie",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1053",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 55,
    "slug": "drop-shoulder-t-shirt-33171",
    "title": "Drop Shoulder T-shirt - 33171",
    "price": 890,
    "originalPrice": 1113,
    "image": "/assets/products/tTXq01787810355-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/tTXq01787810355-light-690x966.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1054",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 56,
    "slug": "os-acid-washtscoffee33410",
    "title": "O.S Acid WashT.S(Coffee)33410",
    "price": 1090,
    "originalPrice": 1363,
    "image": "/assets/products/q216c1787725245-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/q216c1787725245-light-690x966.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1055",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 57,
    "slug": "os-acid-washtslt-brown33411",
    "title": "O.S Acid WashT.S(L.T Brown)33411",
    "price": 1090,
    "originalPrice": 1363,
    "image": "/assets/products/Y0W2K1787724915-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/Y0W2K1787724915-light-690x966.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#654321"
    ],
    "sku": "CMD-1056",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 58,
    "slug": "os-acid-washtsbrown33409",
    "title": "O.S Acid WashT.S(Brown)33409",
    "price": 1090,
    "originalPrice": 1363,
    "image": "/assets/products/bjBsH1787724276-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/bjBsH1787724276-light-690x966.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#654321"
    ],
    "sku": "CMD-1057",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 59,
    "slug": "oversized-t-shirt-anthra-33192",
    "title": "Oversized T-Shirt (Anthra) 33192",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/g9lUL1787689691-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/g9lUL1787689691-light-690x966.png",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1058",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 60,
    "slug": "oversized-t-shirt-ash-33191",
    "title": "Oversized T-Shirt (Ash) 33191",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/4qxzl1787689609-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/4qxzl1787689609-light-690x966.png",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1059",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 61,
    "slug": "os-t-shirtwhite-33427",
    "title": "O/S-T-Shirt(White) 33427",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/aV4rX1787689118-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/aV4rX1787689118-light-690x966.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#f8f8f8"
    ],
    "sku": "CMD-1060",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 62,
    "slug": "os-t-shirtblack-33426",
    "title": "O/S-T-Shirt(Black) 33426",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/dGNd11787688948-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/dGNd11787688948-light-690x966.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1a1a1a"
    ],
    "sku": "CMD-1061",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 63,
    "slug": "os-duying-acid-wash-tscoffee-33419",
    "title": "O/S Duying Acid Wash T.S(Coffee) 33419",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/3kNlz1787724573-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/3kNlz1787724573-light-690x966.png",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1062",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 64,
    "slug": "os-duying-acid-wash-tslt-past33418",
    "title": "O/S Duying Acid Wash T.S(L.T Past)33418",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/vuTww1787748605-light-690x966.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/vuTww1787748605-light-690x966.png",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1063",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 65,
    "slug": "os-duying-acid-wash-tsash-33417",
    "title": "O/S Duying Acid Wash T.S(Ash) 33417",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/PJjVM1788770618-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/PJjVM1788770618-light-1500x2100.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1064",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 66,
    "slug": "os-duying-acid-wash-tsyellow-33416",
    "title": "O/S Duying Acid Wash T.S(Yellow) 33416",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/zRCOH1790166566-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/zRCOH1790166566-light-1500x2100.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1065",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 67,
    "slug": "oversized-t-shirt-sky-blue-33264",
    "title": "Oversized T-Shirt (Sky Blue) 33264",
    "price": 1090,
    "originalPrice": 1363,
    "image": "/assets/products/DDjn71788770788-light-1500x2100.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/DDjn71788770788-light-1500x2100.jpg",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "New Arrival",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#1b2e4b",
      "#111111"
    ],
    "sku": "CMD-1066",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 68,
    "slug": "os-duying-acid-wash-tsash33413",
    "title": "O/S Duying Acid Wash T.S(Ash)33413",
    "price": 990,
    "originalPrice": 1238,
    "image": "/assets/products/HUDs51787721260-light-690x966.jpg",
    "remoteImage": "https://back-office.commandobd.com/productImages/HUDs51787721260-light-690x966.jpg",
    "category": "Men",
    "categorySlug": "Men",
    "isStockOut": true,
    "badge": "",
    "discount": "",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1067",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  },
  {
    "id": 69,
    "slug": "oversized-t-shirt-anthra-33160",
    "title": "Oversized T-Shirt (Anthra) 33160",
    "price": 520,
    "originalPrice": 790,
    "image": "/assets/products/G4Au81787684538-dark-686x961.png",
    "remoteImage": "https://back-office.commandobd.com/productImages/G4Au81787684538-dark-686x961.png",
    "category": "T-Shirt",
    "categorySlug": "T-Shirt",
    "isStockOut": true,
    "badge": "34% OFF",
    "discount": "34",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "#111111"
    ],
    "sku": "CMD-1068",
    "description": "Crafted from premium heavy-weight fabric engineered for ultimate comfort, durability, and tactical aesthetics. Features reinforced stitching, breathable weave, and signature styling that stands the test of time."
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  const decoded = decodeURIComponent(slug);
  return PRODUCTS.find(p => p.slug === decoded || p.slug.toLowerCase() === decoded.toLowerCase());
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const decoded = decodeURIComponent(categorySlug).toLowerCase();
  return PRODUCTS.filter(p => 
    p.categorySlug.toLowerCase() === decoded || 
    p.category.toLowerCase().includes(decoded) ||
    decoded.includes(p.categorySlug.toLowerCase())
  );
}

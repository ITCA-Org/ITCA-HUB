export type ShopCategory = 'Apparel' | 'Accessories';

export type ShopColor = {
  name: string;
  hex: string;
};

export type ShopProduct = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  alt: string;
  tone: string;
  /** Price in Gambian Dalasi */
  price: number;
  category: ShopCategory;
  colors: ShopColor[];
  sizes: string[];
};

export const SHOP_CATEGORIES: Array<'All' | ShopCategory> = ['All', 'Apparel', 'Accessories'];

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = {
  ink: { name: 'Ink', hex: '#0A1628' },
  orange: { name: 'Orange', hex: '#FF6A00' },
  white: { name: 'White', hex: '#FFFFFF' },
  blue: { name: 'ITCA Blue', hex: '#005080' },
  softBlue: { name: 'Sky', hex: '#D4E6F2' },
  softOrange: { name: 'Peach', hex: '#FFE0CC' },
  grey: { name: 'Heather Grey', hex: '#9CA3AF' },
  black: { name: 'Black', hex: '#141414' },
} as const;

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'classic-tee',
    name: 'ITCA Classic Tee',
    blurb: 'Soft cotton tee with orange ink logo. Everyday wear for labs and lectures.',
    image: '/ITCA_BOOTCAMP/IMG_8866.jpg',
    alt: 'Students at an ITCA bootcamp',
    tone: '#FFE0CC',
    price: 350,
    category: 'Apparel',
    colors: [COLORS.white, COLORS.ink, COLORS.orange, COLORS.blue],
    sizes: APPAREL_SIZES,
  },
  {
    id: 'week-tee',
    name: 'ITCA Week Tee',
    blurb: 'Limited drop for ITCA Week. Bold print, unisex fit.',
    image: '/ITCA_WEEK/IMG_4517.jpg',
    alt: 'ITCA Week gathering on campus',
    tone: '#D4E6F2',
    price: 400,
    category: 'Apparel',
    colors: [COLORS.orange, COLORS.blue, COLORS.white, COLORS.black],
    sizes: APPAREL_SIZES,
  },
  {
    id: 'campus-polo',
    name: 'Campus Polo',
    blurb: 'Clean collar for presentations, open days, and association events.',
    image: '/ITCA_WEEK/IMG_4374.jpg',
    alt: 'Students in a lecture setting',
    tone: '#FFE0CC',
    price: 550,
    category: 'Apparel',
    colors: [COLORS.ink, COLORS.blue, COLORS.white],
    sizes: APPAREL_SIZES,
  },
  {
    id: 'hoodie',
    name: 'ITCA Hoodie',
    blurb: 'Campus nights, bootcamp mornings—heavyweight fleece with association mark.',
    image: '/ITCA_WEEK/IMG_4237.jpg',
    alt: 'ITCA students on campus',
    tone: '#D4E6F2',
    price: 850,
    category: 'Apparel',
    colors: [COLORS.ink, COLORS.grey, COLORS.orange, COLORS.blue],
    sizes: APPAREL_SIZES,
  },
  {
    id: 'crewneck',
    name: 'Crewneck Sweatshirt',
    blurb: 'Midweight crew for cool Faraba mornings. Soft inside, durable outside.',
    image: '/ITCA_BOOTCAMP/IMG_9041.jpg',
    alt: 'Students at ITCA bootcamp',
    tone: '#FFE0CC',
    price: 750,
    category: 'Apparel',
    colors: [COLORS.softOrange, COLORS.ink, COLORS.grey, COLORS.white],
    sizes: APPAREL_SIZES,
  },
  {
    id: 'sports-jersey',
    name: 'Sports Day Jersey',
    blurb: 'Breathable kit for ITCA sports and friendly matches on campus.',
    image: '/ITCA_SPORTS/IMG_8179.jpg',
    alt: 'ITCA sports on campus',
    tone: '#D4E6F2',
    price: 600,
    category: 'Apparel',
    colors: [COLORS.orange, COLORS.blue, COLORS.white],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'campus-cap',
    name: 'Campus Cap',
    blurb: 'Sun, sports day, or just showing School of ICT pride.',
    image: '/ITCA_SPORTS/IMG_8212.jpg',
    alt: 'ITCA sports on campus',
    tone: '#FFE0CC',
    price: 250,
    category: 'Accessories',
    colors: [COLORS.ink, COLORS.orange, COLORS.blue, COLORS.white],
    sizes: ['One size'],
  },
  {
    id: 'tote-bag',
    name: 'ITCA Tote Bag',
    blurb: 'Carry notes, laptop sleeve, and snacks between lectures.',
    image: '/ITCA_WEEK/IMG_4094.jpg',
    alt: 'Students with laptops',
    tone: '#D4E6F2',
    price: 200,
    category: 'Accessories',
    colors: [COLORS.softBlue, COLORS.ink, COLORS.orange],
    sizes: ['One size'],
  },
  {
    id: 'laptop-sleeve',
    name: 'Laptop Sleeve',
    blurb: 'Padded 13–15" sleeve with subtle ITCA branding.',
    image: '/ITCA_BOOTCAMP/IMG_8789.jpg',
    alt: 'Students collaborating at bootcamp',
    tone: '#FFE0CC',
    price: 450,
    category: 'Accessories',
    colors: [COLORS.ink, COLORS.grey, COLORS.blue],
    sizes: ['13"', '14"', '15"'],
  },
  {
    id: 'water-bottle',
    name: 'Water Bottle',
    blurb: 'Stay hydrated through workshops and long lab sessions.',
    image: '/ITCA_RETREAT/retreat-lunch.jpg',
    alt: 'Students sharing a meal at retreat',
    tone: '#D4E6F2',
    price: 300,
    category: 'Accessories',
    colors: [COLORS.blue, COLORS.orange, COLORS.ink, COLORS.white],
    sizes: ['500ml', '750ml'],
  },
  {
    id: 'lanyard',
    name: 'Lanyard & ID Holder',
    blurb: 'Campus events, scanners, and member check-in—ready to clip.',
    image: '/ITCA_RETREAT/retreat-handshake.jpg',
    alt: 'ITCA members connecting at retreat',
    tone: '#FFE0CC',
    price: 100,
    category: 'Accessories',
    colors: [COLORS.orange, COLORS.blue, COLORS.ink],
    sizes: ['One size'],
  },
  {
    id: 'sticker-pack',
    name: 'Sticker Pack',
    blurb: 'Six vinyl stickers for laptops, bottles, and notebooks.',
    image: '/ITCA_RETREAT/KG__0418.jpg',
    alt: 'ITCA retreat moments',
    tone: '#D4E6F2',
    price: 75,
    category: 'Accessories',
    colors: [COLORS.softOrange, COLORS.softBlue],
    sizes: ['Standard'],
  },
];

export const formatDalasi = (amount: number) => `D${amount.toLocaleString('en-GM')}`;

export const getShopProduct = (id: string) => SHOP_PRODUCTS.find((p) => p.id === id);

export const cartLineKey = (productId: string, color: string, size: string) =>
  `${productId}__${color}__${size}`;

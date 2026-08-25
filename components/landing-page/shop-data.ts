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

export const SHOP_CATEGORIES: Array<'All' | ShopCategory> = [
  'All',
  'Apparel',
  'Accessories',
];

export const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const DEFAULT_SHOP_COLORS: ShopColor[] = [
  { name: 'Ink', hex: '#0A1628' },
  { name: 'Orange', hex: '#FF6A00' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'ITCA Blue', hex: '#005080' },
  { name: 'Sky', hex: '#D4E6F2' },
  { name: 'Peach', hex: '#FFE0CC' },
  { name: 'Heather Grey', hex: '#9CA3AF' },
  { name: 'Black', hex: '#141414' },
];

export const formatDalasi = (amount: number) =>
  `D${amount.toLocaleString('en-GM')}`;

export const cartLineKey = (productId: string, color: string, size: string) =>
  `${productId}__${color}__${size}`;

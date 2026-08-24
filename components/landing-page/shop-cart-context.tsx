import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  cartLineKey,
  getShopProduct,
  type ShopProduct,
} from '@/components/landing-page/shop-data';

const STORAGE_KEY = 'itca-shop-cart-v2';

export type CartLine = {
  productId: string;
  color: string;
  size: string;
  quantity: number;
};

export type DetailedCartLine = {
  key: string;
  product: ShopProduct;
  color: string;
  size: string;
  quantity: number;
  lineTotal: number;
};

type AddItemOptions = {
  color: string;
  size: string;
  quantity?: number;
};

type ShopCartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, options: AddItemOptions) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  detailedLines: DetailedCartLine[];
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

const isValidLine = (line: CartLine) => {
  const product = getShopProduct(line.productId);
  if (!product || line.quantity <= 0) return false;
  const hasColor = product.colors.some((c) => c.name === line.color);
  const hasSize = product.sizes.includes(line.size);
  return hasColor && hasSize;
};

const readStoredLines = (): CartLine[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        typeof line?.productId === 'string' &&
        typeof line?.color === 'string' &&
        typeof line?.size === 'string' &&
        typeof line?.quantity === 'number' &&
        isValidLine(line)
    );
  } catch {
    return [];
  }
};

export const ShopCartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback((productId: string, options: AddItemOptions) => {
    const product = getShopProduct(productId);
    if (!product) return;

    const color = options.color;
    const size = options.size;
    const quantity = options.quantity ?? 1;

    if (!product.colors.some((c) => c.name === color) || !product.sizes.includes(size)) {
      return;
    }

    setLines((prev) => {
      const key = cartLineKey(productId, color, size);
      const existing = prev.find(
        (line) => cartLineKey(line.productId, line.color, line.size) === key
      );
      if (existing) {
        return prev.map((line) =>
          cartLineKey(line.productId, line.color, line.size) === key
            ? { ...line, quantity: line.quantity + quantity }
            : line
        );
      }
      return [...prev, { productId, color, size, quantity }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setLines((prev) =>
      prev.filter((line) => cartLineKey(line.productId, line.color, line.size) !== key)
    );
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setLines((prev) =>
        prev.filter((line) => cartLineKey(line.productId, line.color, line.size) !== key)
      );
      return;
    }
    setLines((prev) =>
      prev.map((line) =>
        cartLineKey(line.productId, line.color, line.size) === key
          ? { ...line, quantity }
          : line
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const detailedLines = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getShopProduct(line.productId);
          if (!product) return null;
          return {
            key: cartLineKey(line.productId, line.color, line.size),
            product,
            color: line.color,
            size: line.size,
            quantity: line.quantity,
            lineTotal: product.price * line.quantity,
          };
        })
        .filter((line): line is DetailedCartLine => Boolean(line)),
    [lines]
  );

  const itemCount = useMemo(
    () => detailedLines.reduce((sum, line) => sum + line.quantity, 0),
    [detailedLines]
  );

  const subtotal = useMemo(
    () => detailedLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [detailedLines]
  );

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      itemCount,
      subtotal,
      detailedLines,
    }),
    [
      lines,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      itemCount,
      subtotal,
      detailedLines,
    ]
  );

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
};

export const useShopCart = () => {
  const ctx = useContext(ShopCartContext);
  if (!ctx) {
    throw new Error('useShopCart must be used within ShopCartProvider');
  }
  return ctx;
};

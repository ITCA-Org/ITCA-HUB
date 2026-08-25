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
  type ShopProduct,
} from '@/components/landing-page/shop-data';
import { useShopProducts } from '@/hooks/shop/use-shop';

const STORAGE_KEY = 'itca-shop-cart-v3';

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
  products: ShopProduct[];
  productsLoading: boolean;
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
        line.quantity > 0
    );
  } catch {
    return [];
  }
};

export const ShopCartProvider = ({ children }: { children: ReactNode }) => {
  const { products, isLoading: productsLoading } = useShopProducts();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const productMap = useMemo(() => {
    const map = new Map<string, ShopProduct>();
    for (const product of products) {
      map.set(product.id, product);
    }
    return map;
  }, [products]);

  useEffect(() => {
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || productsLoading) return;
    setLines((prev) =>
      prev.filter((line) => {
        const product = productMap.get(line.productId);
        if (!product) return false;
        return (
          product.colors.some((c) => c.name === line.color) &&
          product.sizes.includes(line.size)
        );
      })
    );
  }, [hydrated, productsLoading, productMap]);

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

  const addItem = useCallback(
    (productId: string, options: AddItemOptions) => {
      const product = productMap.get(productId);
      if (!product) return;

      const color = options.color;
      const size = options.size;
      const quantity = options.quantity ?? 1;

      if (
        !product.colors.some((c) => c.name === color) ||
        !product.sizes.includes(size)
      ) {
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
    },
    [productMap]
  );

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
          const product = productMap.get(line.productId);
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
    [lines, productMap]
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
      products,
      productsLoading,
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
      products,
      productsLoading,
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

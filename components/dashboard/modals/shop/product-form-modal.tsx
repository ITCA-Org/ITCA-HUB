import axios from 'axios';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  APPAREL_SIZES,
  DEFAULT_SHOP_COLORS,
  type ShopCategory,
  type ShopColor,
} from '@/components/landing-page/shop-data';
import {
  createShopProduct,
  ShopProductApi,
  ShopProductInput,
  updateShopProduct,
} from '@/hooks/shop/use-shop';
import { getErrorMessage } from '@/utils/error';
import { JEETIX_BASE_URL } from '@/utils/url';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

type ProductFormModalProps = {
  isOpen: boolean;
  token: string;
  product?: ShopProductApi | null;
  onClose: () => void;
  onSaved: () => void;
};

const ProductFormModal = ({
  isOpen,
  token,
  product,
  onClose,
  onSaved,
}: ProductFormModalProps) => {
  const isEdit = Boolean(product);
  const [name, setName] = useState('');
  const [blurb, setBlurb] = useState('');
  const [price, setPrice] = useState('350');
  const [category, setCategory] = useState<ShopCategory>('Apparel');
  const [alt, setAlt] = useState('');
  const [tone, setTone] = useState('#D4E6F2');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [colors, setColors] = useState<ShopColor[]>([
    DEFAULT_SHOP_COLORS[0],
    DEFAULT_SHOP_COLORS[1],
  ]);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [customSize, setCustomSize] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (product) {
      setName(product.name);
      setBlurb(product.blurb);
      setPrice(String(product.price));
      setCategory(product.category);
      setAlt(product.alt || '');
      setTone(product.tone || '#D4E6F2');
      setImageUrl(product.imageUrl);
      setImagePreview(product.imageUrl);
      setImageFile(null);
      setColors(product.colors);
      setSizes(product.sizes);
      setIsActive(product.isActive);
    } else {
      setName('');
      setBlurb('');
      setPrice('350');
      setCategory('Apparel');
      setAlt('');
      setTone('#D4E6F2');
      setImageUrl('');
      setImagePreview('');
      setImageFile(null);
      setColors([DEFAULT_SHOP_COLORS[0], DEFAULT_SHOP_COLORS[1]]);
      setSizes(['S', 'M', 'L', 'XL']);
      setIsActive(true);
    }
    setCustomSize('');
  }, [isOpen, product]);

  const toggleColor = (color: ShopColor) => {
    setColors((prev) => {
      const exists = prev.some((c) => c.name === color.name);
      if (exists) {
        if (prev.length <= 1) return prev;
        return prev.filter((c) => c.name !== color.name);
      }
      return [...prev, color];
    });
  };

  const toggleSize = (size: string) => {
    setSizes((prev) => {
      if (prev.includes(size)) {
        if (prev.length <= 1) return prev;
        return prev.filter((s) => s !== size);
      }
      return [...prev, size];
    });
  };

  const addCustomSize = () => {
    const value = customSize.trim();
    if (!value) return;
    if (!sizes.includes(value)) {
      setSizes((prev) => [...prev, value]);
    }
    setCustomSize('');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'shop-products');
    const { data } = await axios.post(
      `${JEETIX_BASE_URL}/api/storage/upload`,
      formData
    );
    return data.data.fileUrl as string;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Use JPEG, PNG, or WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!name.trim() || !blurb.trim() || !price) {
      toast.error('Name, blurb, and price are required');
      return;
    }
    if (!imageFile && !imageUrl) {
      toast.error('Please upload a product image');
      return;
    }
    if (colors.length === 0 || sizes.length === 0) {
      toast.error('Pick at least one color and size');
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload: ShopProductInput = {
        name: name.trim(),
        blurb: blurb.trim(),
        imageUrl: finalImageUrl,
        alt: alt.trim() || name.trim(),
        tone: tone.trim() || '#D4E6F2',
        price: Number(price),
        category,
        colors,
        sizes,
        isActive,
      };

      if (isEdit && product) {
        await updateShopProduct(product._id, payload, token);
        toast.success('Product updated');
      } else {
        await createShopProduct(payload, token);
        toast.success('Product created');
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error(isEdit ? 'Update failed' : 'Create failed', {
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSaving && onClose()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isEdit ? 'Edit product' : 'Add product'}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit product' : 'Add product'}
              </h2>
              <button
                type="button"
                disabled={isSaving}
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Blurb
                  </span>
                  <textarea
                    required
                    rows={3}
                    value={blurb}
                    onChange={(e) => setBlurb(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Price (GMD)
                    </span>
                    <input
                      required
                      type="number"
                      min={1}
                      step={1}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Category
                    </span>
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as ShopCategory)
                      }
                      className={inputClass}
                    >
                      <option value="Apparel">Apparel</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Image
                  </span>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 hover:bg-gray-100">
                    {imagePreview ? (
                      <div className="relative h-36 w-full overflow-hidden rounded-lg">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Upload product photo
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Colors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SHOP_COLORS.map((color) => {
                      const active = colors.some((c) => c.name === color.name);
                      return (
                        <button
                          key={color.name}
                          type="button"
                          title={color.name}
                          onClick={() => toggleColor(color)}
                          className={`h-9 w-9 rounded-full border-2 ${
                            active ? 'border-blue-600' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Sizes
                  </span>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {APPAREL_SIZES.map((size) => {
                      const active = sizes.includes(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                            active
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                    {sizes
                      .filter((s) => !APPAREL_SIZES.includes(s))
                      .map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className="rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="Custom size (e.g. One size)"
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={addCustomSize}
                      className="shrink-0 rounded-lg bg-gray-800 px-3 text-sm font-medium text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Alt text
                    </span>
                    <input
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Tone hex
                    </span>
                    <input
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Active (visible in public shop)
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={onClose}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving && <Loader className="h-4 w-4 animate-spin" />}
                  {isEdit ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;

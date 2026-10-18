import axios from 'axios';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  createDonationCampaign,
  DONATION_CATEGORY_LABELS,
  DonationCampaign,
  DonationCampaignCategory,
  DonationCampaignInput,
  updateDonationCampaign,
} from '@/hooks/donations/use-donations';
import { getErrorMessage } from '@/utils/error';
import { JEETIX_BASE_URL } from '@/utils/url';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

const toDateInput = (value?: string | null) => (value ? value.slice(0, 10) : '');

type CampaignFormModalProps = {
  isOpen: boolean;
  token: string;
  campaign?: DonationCampaign | null;
  onClose: () => void;
  onSaved: () => void;
};

const CampaignFormModal = ({
  isOpen,
  token,
  campaign,
  onClose,
  onSaved,
}: CampaignFormModalProps) => {
  const isEdit = Boolean(campaign);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DonationCampaignCategory>('hackathon');
  const [goalAmount, setGoalAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(campaign?.title ?? '');
    setSummary(campaign?.summary ?? '');
    setDescription(campaign?.description ?? '');
    setCategory(campaign?.category ?? 'hackathon');
    setGoalAmount(campaign?.goalAmount ? String(campaign.goalAmount) : '');
    setStartDate(toDateInput(campaign?.startDate));
    setEndDate(toDateInput(campaign?.endDate));
    setImageUrl(campaign?.imageUrl ?? '');
    setImagePreview(campaign?.imageUrl ?? '');
    setImageFile(null);
    setIsActive(campaign?.isActive ?? true);
  }, [isOpen, campaign]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'donation-campaigns');
    const { data } = await axios.post(`${JEETIX_BASE_URL}/api/storage/upload`, formData);
    return data.data.fileUrl as string;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
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

    if (!title.trim() || !summary.trim()) {
      toast.error('Title and summary are required');
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      toast.error('End date must be after the start date');
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const payload: DonationCampaignInput = {
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        category,
        imageUrl: finalImageUrl,
        goalAmount: Number(goalAmount) || 0,
        startDate: startDate || null,
        endDate: endDate ? `${endDate}T23:59:59` : null,
        isActive,
      };

      if (isEdit && campaign) {
        await updateDonationCampaign(campaign._id, payload, token);
        toast.success('Campaign updated');
      } else {
        await createDonationCampaign(payload, token);
        toast.success('Campaign created');
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error(isEdit ? 'Update failed' : 'Create failed', { description: message });
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
            aria-label={isEdit ? 'Edit campaign' : 'New campaign'}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEdit ? 'Edit campaign' : 'New campaign'}
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

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Title</span>
                  <input
                    value={title}
                    maxLength={120}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ITCA Hackathon 2026"
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Activity</span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DonationCampaignCategory)}
                      className={inputClass}
                    >
                      {Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Goal (GMD, optional)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">Summary</span>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="One or two lines shown on the campaign card"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Full description (optional)
                  </span>
                  <textarea
                    rows={5}
                    maxLength={5000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={inputClass}
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Opens (optional)
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Closes (optional)
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Cover image (optional)
                  </span>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative h-20 w-32 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={imagePreview}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                      <Upload className="h-4 w-4" />
                      {imagePreview ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Active (visible on the public donate page)
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
                  {isEdit ? 'Save changes' : 'Create campaign'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CampaignFormModal;

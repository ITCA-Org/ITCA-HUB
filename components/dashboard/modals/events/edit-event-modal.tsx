import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateEventData } from '@/types/interfaces/event';
import { EditEventModalProps } from '@/types/interfaces/modal';
import { X, Calendar, Save, Loader, Upload } from 'lucide-react';

const EditEventModal = ({ isOpen, event, onClose, onSave }: EditEventModalProps) => {
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [capacity, setCapacity] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [location, setLocation] = useState('');
  const [toDate, setToDate] = useState('');
  const [toTime, setToTime] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');

      const eventDate = new Date(event.date);
      setDate(eventDate.toISOString().split('T')[0]);

      const eventTime = new Date(event.time);
      const hours = eventTime.getHours().toString().padStart(2, '0');
      const minutes = eventTime.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      if (event.toDate) {
        const eventToDate = new Date(event.toDate);
        setToDate(eventToDate.toISOString().split('T')[0]);
      } else {
        setToDate('');
      }

      if (event.toTime) {
        const eventToTime = new Date(event.toTime);
        const toHours = eventToTime.getHours().toString().padStart(2, '0');
        const toMinutes = eventToTime.getMinutes().toString().padStart(2, '0');
        setToTime(`${toHours}:${toMinutes}`);
      } else {
        setToTime('');
      }

      setLocation(event.location);
      setCapacity(event.capacity);
      setRegistrationRequired(event.registrationRequired);
      setCurrentImageUrl(event.imageUrl || '');
      setImagePreview('');
      setImage(null);
    }
  }, [event]);

  const resetForm = () => {
    setDate('');
    setTime('');
    setToDate('');
    setToTime('');
    setTitle('');
    setImage(null);
    setLocation('');
    setCapacity(50);
    setDescription('');
    setImagePreview('');
    setCurrentImageUrl('');
    setRegistrationRequired(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'events');

    const { data } = await axios.post(
      'https://jeetix-file-service.onrender.com/api/storage/upload',
      formData
    );
    return data.data.fileUrl;
  };

  const handleSave = async () => {
    if (!event || !title.trim() || !date || !time || !location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = currentImageUrl;

      if (image) {
        setIsUploadingImage(true);
        imageUrl = await uploadImage(image);
        setIsUploadingImage(false);
      }

      const eventDate = new Date(date).toISOString();
      const eventTime = new Date(`${date}T${time}:00.000Z`).toISOString();

      const eventData: CreateEventData = {
        title,
        location,
        capacity,
        imageUrl,
        description,
        time: eventTime,
        date: eventDate,
        registrationRequired,
        ...(toDate && { toDate: new Date(toDate).toISOString() }),
        ...(toTime && { toTime: new Date(`${toDate || date}T${toTime}:00.000Z`).toISOString() }),
      };

      await onSave(event._id, eventData);
      resetForm();
      onClose();
    } catch {
      setIsUploadingImage(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onClose();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/*==================== Background Overlay ====================*/}
          <motion.div
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          {/*==================== End of Background Overlay ====================*/}

          {/*==================== Modal Content ====================*/}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              damping: 20,
              duration: 0.3,
              type: 'spring',
              stiffness: 300,
            }}
          >
            <div className="relative p-6">
              {/*==================== Modal Header ====================*/}
              <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium flex items-center">
                    <span className="text-blue-700 mr-2">Edit</span>
                    <span className="text-amber-500">Event</span>
                    <span className="ml-3 relative">
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    </span>
                  </h3>
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleClose}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/*==================== End of Modal Header ====================*/}

              {/*==================== Form Content ====================*/}
              <div className="mb-6">
                {/*==================== Title ====================*/}
                <div className="mb-7">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                    Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="title"
                    type="text"
                    value={title}
                    placeholder="Enter event title..."
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Title ====================*/}

                {/*==================== Description ====================*/}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    id="description"
                    value={description}
                    placeholder="Describe your event..."
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Description ====================*/}

                {/*==================== From and To Date ====================*/}
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-700">Date & Time</h3>
                  <div>
                    {/*==================== From Date and Time ====================*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/*==================== Date ====================*/}
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          From Date: <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      {/*==================== End of Date ====================*/}

                      {/*==================== Time ====================*/}
                      <div>
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          From Time: <span className="text-red-500">*</span>
                        </label>
                        <input
                          required
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      {/*==================== End of Time ====================*/}
                    </div>
                    {/*==================== End of From Date and Time ====================*/}

                    {/*==================== To Date and Time ====================*/}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {/*==================== Date ====================*/}
                      <div>
                        <label
                          htmlFor="toDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          To Date:
                        </label>
                        <input
                          id="toDate"
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      {/*==================== End of Date ====================*/}

                      {/*==================== Time ====================*/}
                      <div>
                        <label
                          htmlFor="toTime"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          To Time:
                        </label>
                        <input
                          id="toTime"
                          type="time"
                          value={toTime}
                          onChange={(e) => setToTime(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>
                      {/*==================== End of Time ====================*/}
                    </div>
                    {/*==================== End of To Date and Time ====================*/}
                  </div>
                </div>
                {/*==================== End of From and To Date ====================*/}

                {/*==================== Location ====================*/}
                <div className="mb-8">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Lab 302, Virtual (Zoom), Main Auditorium"
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
                {/*==================== End of Location ====================*/}

                {/*==================== Capacity and Registration Container ====================*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {/*==================== Capacity ====================*/}
                  <div>
                    <label
                      htmlFor="capacity"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Capacity
                    </label>
                    <input
                      min="1"
                      type="number"
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value) || 50)}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                  </div>
                  {/*==================== End of Capacity ====================*/}

                  {/*==================== Registration Required Checkbox ====================*/}
                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={registrationRequired}
                        onChange={(e) => setRegistrationRequired(e.target.checked)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        Registration Required
                      </span>
                    </label>
                  </div>
                  {/*==================== End of Registration Required Checkbox ====================*/}
                </div>
                {/*==================== End of Capacity and Registration Container ====================*/}

                {/*==================== Image Upload ====================*/}
                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
                    Event Flyer (Optional - leave blank to keep current)
                  </label>

                  {/*==================== Show current image if exists ====================*/}
                  {currentImageUrl && !imagePreview && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          fill
                          src={currentImageUrl}
                          alt="Current event flyer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {/*==================== End of Show current image if exists ====================*/}

                  <div className="relative">
                    <input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {image ? image.name : 'Click to upload new event flyer or drag & drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (max 5MB)</p>
                    </div>
                  </div>

                  {/*====================  New Image Preview ==================== */}
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          fill
                          src={imagePreview}
                          alt="New event flyer preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {/*====================  End of New Image Preview ==================== */}
                </div>
                {/*==================== End of Image Upload ====================*/}
              </div>
              {/*==================== End of Form Content ====================*/}

              {/*==================== Action Buttons ====================*/}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSaving}
                  className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !title.trim() || !date || !time || !location.trim()}
                  className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      {isUploadingImage ? 'Uploading Flyer...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Event
                    </>
                  )}
                </button>
              </div>
              {/*==================== End of Action Buttons ====================*/}
            </div>
          </motion.div>
          {/*==================== End of Modal Content ====================*/}
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditEventModal;

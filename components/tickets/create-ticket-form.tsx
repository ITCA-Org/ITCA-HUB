import { useEffect, useMemo, useState } from 'react';
import { Calendar, Mail, Phone, Tag, Ticket, User } from 'lucide-react';
import { EventProps } from '@/types/interfaces/event';
import { CreateTicketData, TicketType } from '@/types/interfaces/ticket';

interface CreateTicketFormProps {
  eventId?: string;
  events: EventProps[];
  isLoadingEvents: boolean;
  onSubmit: (data: CreateTicketData) => Promise<void>;
  onCancel: () => void;
}

const initialErrors: Partial<Record<keyof CreateTicketData, string>> = {};

const CreateTicketForm = ({
  eventId,
  events,
  isLoadingEvents,
  onSubmit,
  onCancel,
}: CreateTicketFormProps) => {
  const ticketedEvents = useMemo(
    () => events.filter((event) => event.requiresTicket),
    [events]
  );
  const [formData, setFormData] = useState<CreateTicketData>({
    eventId: eventId ?? ticketedEvents[0]?._id ?? '',
    attendeeName: '',
    email: '',
    phoneNumber: '',
    ticketType: 'Student',
  });
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTicketedEvents = Boolean(eventId) || ticketedEvents.length > 0;

    
  useEffect(() => {
    if (eventId) {
      setFormData((prev) => ({ ...prev, eventId }));
    }
  }, [eventId]);

  useEffect(() => {
    setFormData((prev) => {
      if (!prev.eventId) return prev;

      const exists = ticketedEvents.some((e) => e._id === prev.eventId);
      if (exists) return prev;

      return {
        ...prev,
        eventId: ticketedEvents[0]?._id || '',
      };
    });
  }, [ticketedEvents]);


  const validate = () => {
    const nextErrors: Partial<Record<keyof CreateTicketData, string>> = {};

    if (!formData.eventId.trim()) nextErrors.eventId = 'Select an event that requires ticketing';
    if (formData.attendeeName.trim().length < 2) nextErrors.attendeeName = 'Enter the attendee name';
    if (!formData.phoneNumber.trim()) nextErrors.phoneNumber = 'Phone number is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        email: formData.email?.trim() || undefined,
        eventId: formData.eventId.trim(),
        attendeeName: formData.attendeeName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (name: keyof CreateTicketData, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="h-4 w-4 text-blue-600" />
          Event
        </span>
        <select
          value={formData.eventId}
          onChange={(event) => updateField('eventId', event.target.value)}
          disabled={Boolean(eventId) || isLoadingEvents || !hasTicketedEvents}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
        >
          {eventId ? (
            <option value={eventId}>Selected event</option>
          ) : isLoadingEvents ? (
            <option value="">Loading ticketed events...</option>
          ) : !hasTicketedEvents ? (
            <option value="">No events require ticketing</option>
          ) : (
            <>
              <option value="">Select an event</option>
              {ticketedEvents.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </>
          )}
        </select>
        {errors.eventId && <span className="mt-1 block text-xs text-red-600">{errors.eventId}</span>}
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
          <User className="h-4 w-4 text-blue-600" />
          Attendee name
        </span>
        <input
          value={formData.attendeeName}
          onChange={(event) => updateField('attendeeName', event.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="Full name"
        />
        {errors.attendeeName && <span className="mt-1 block text-xs text-red-600">{errors.attendeeName}</span>}
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Mail className="h-4 w-4 text-blue-600" />
          Email
        </span>
        <input
          type="email"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="name@example.com"
        />
        {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email}</span>}
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Phone className="h-4 w-4 text-blue-600" />
          Phone number
        </span>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(event) => updateField('phoneNumber', event.target.value)}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          placeholder="+220 000 0000"
        />
        {errors.phoneNumber && <span className="mt-1 block text-xs text-red-600">{errors.phoneNumber}</span>}
      </label>

      <label className="block">
        <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Tag className="h-4 w-4 text-blue-600" />
          Ticket type
        </span>
        <select
          value={formData.ticketType}
          onChange={(event) => updateField('ticketType', event.target.value as TicketType)}
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="Student">Student</option>
          <option value="VIP">VIP</option>
        </select>
      </label>

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoadingEvents || !hasTicketedEvents}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <Ticket className="h-4 w-4" />
          {isSubmitting ? 'Issuing...' : 'Issue Ticket'}
        </button>
      </div>
    </form>
  );
};

export default CreateTicketForm;

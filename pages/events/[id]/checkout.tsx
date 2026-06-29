import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import { ArrowLeft, Loader, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { BASE_URL } from '@/utils/url';
import { checkoutTicket } from '@/hooks/tickets/use-tickets';
import { EventProps } from '@/types/interfaces/event';
import { getErrorMessage } from '@/utils/error';

const CheckoutPage = () => {
  const router = useRouter();
  const { id, tier } = router.query;
  const [event, setEvent] = useState<EventProps | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierType = tier as 'standard' | 'premium';

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/events/${id}/public`);
        setEvent(data.data);
      } catch {
        toast.error('Failed to load event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const selectedTier = event?.ticketTiers?.find(
    (t) => t.type === tierType && t.enabled
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !selectedTier) return;

    setIsSubmitting(true);
    try {
      const result = await checkoutTicket({
        eventId: event._id,
        tierType,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim() || undefined,
      });
      window.location.href = result.paymentLink;
    } catch (error) {
      toast.error('Checkout failed', {
        description: getErrorMessage(error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!event || !selectedTier) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Event or ticket tier not found.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to events
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <Ticket className="h-5 w-5" />
            <span className="font-medium">Ticket Checkout</span>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h1>
          <p className="text-gray-500 text-sm mb-6">{event.location}</p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="font-semibold text-gray-900">{selectedTier.label}</p>
            <p className="text-2xl font-bold text-blue-600">D{selectedTier.price}</p>
            {selectedTier.benefits && (
              <p className="text-sm text-gray-600 mt-1">{selectedTier.benefits}</p>
            )}
          </div>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-sm"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide your email to receive your ticket automatically
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay D${selectedTier.price} via Modem Pay`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

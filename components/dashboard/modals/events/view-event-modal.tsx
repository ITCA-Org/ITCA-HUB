import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { X, Calendar, Ticket, DollarSign } from 'lucide-react';
import { useEventActions } from '@/hooks/events/use-event';
import { ViewEventModalProps, EventProps } from '@/types/interfaces/event';
import { getEventSales } from '@/hooks/tickets/use-tickets';
import { EventSalesData } from '@/types/interfaces/ticket';
import ViewEventModalSkeleton from '../../skeletons/view-event-modal-skeleton';

const ViewEventModal = ({ isOpen, eventId, onClose, role, token }: ViewEventModalProps) => {
  const [event, setEvent] = useState<EventProps | null>(null);
  const [sales, setSales] = useState<EventSalesData | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'sales'>('details');
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { getEventById } = useEventActions(token);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isOpen || !eventId) return;

      setIsLoading(true);
      setError(null);

      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        if (eventData.ticketingEnabled && role === 'admin') {
          const salesData = await getEventSales(eventId, token);
          setSales(salesData);
        }
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [isOpen, eventId, getEventById, role, token]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!isOpen) return null;

  if (isLoading || (!event && !error)) {
    return <ViewEventModalSkeleton />;
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-center text-gray-500">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto relative hide-scrollbar">
        <div>
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-[1.3rem] md:text-2xl font-bold text-gray-900">{event.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {role === 'admin' && event.ticketingEnabled && (
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeTab === 'sales'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                Sales
              </button>
            </div>
          )}

          {activeTab === 'sales' && sales ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm font-medium">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    D{sales.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Ticket className="h-4 w-4" />
                    <span className="text-sm font-medium">Tickets Sold</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {sales.ticketsSold} / {sales.capacity}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-600 mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-gray-900">{sales.remainingCapacity}</p>
                </div>
              </div>

              {sales.tierBreakdown.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">By Tier</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {sales.tierBreakdown.map((tier, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-medium text-gray-900">{tier.label}</p>
                        <p className="text-sm text-gray-500">
                          {tier.count} sold · D{tier.revenue.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Orders</h3>
                {sales.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="pb-2 pr-4">Buyer</th>
                          <th className="pb-2 pr-4">Tier</th>
                          <th className="pb-2 pr-4">Amount</th>
                          <th className="pb-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sales.orders.map((order) => (
                          <tr key={order._id} className="border-b border-gray-100">
                            <td className="py-2 pr-4">
                              <p className="font-medium">{order.buyerName}</p>
                              {order.buyerEmail && (
                                <p className="text-xs text-gray-500">{order.buyerEmail}</p>
                              )}
                            </td>
                            <td className="py-2 pr-4 capitalize">{order.tierType}</td>
                            <td className="py-2 pr-4">D{order.amount}</td>
                            <td className="py-2 text-gray-500">
                              {formatDateTime(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No ticket sales yet</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="rounded-lg overflow-hidden aspect-video w-full relative">
                  {event.imageUrl && !imageError ? (
                    <Image
                      fill
                      priority
                      alt={event.title}
                      src={event.imageUrl}
                      onError={() => setImageError(true)}
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-linear-to-br from-blue-500 via-amber-300 to-blue-500 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-white/80" />
                    </div>
                  )}
                </div>
              </div>

              {event.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Description</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{event.description}</p>
                </div>
              )}

              {event.ticketingEnabled && event.ticketTiers && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-900">Ticket Tiers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.ticketTiers
                      .filter((t) => t.enabled)
                      .map((tier) => (
                        <div key={tier.type} className="border border-gray-200 rounded-lg p-4">
                          <p className="font-medium">{tier.label}</p>
                          <p className="text-blue-600 font-semibold">D{tier.price}</p>
                          {tier.benefits && (
                            <p className="text-sm text-gray-500 mt-1">{tier.benefits}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {role === 'admin' && (
                <div className="grid grid-cols-1 mb-6 border-t border-b">
                  <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-md text-gray-500 mb-1">Created At</p>
                      <p className="text-md font-medium text-gray-900">
                        {formatDateTime(event.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-md text-gray-500 mb-1">Last Updated</p>
                      <p className="text-md font-medium text-gray-900">
                        {formatDateTime(event.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-md text-gray-500 mb-1">Created By</p>
                      <p className="text-md font-medium text-gray-900">
                        {event.createdBy.firstName} {event.createdBy.lastName}
                      </p>
                      <p className="text-md text-gray-500">{event.createdBy.schoolEmail}</p>
                    </div>
                    <div>
                      <p className="text-md text-gray-500 mb-1">Last Updated By</p>
                      {event.updatedBy ? (
                        <>
                          <p className="text-md font-medium text-gray-900">
                            {event.updatedBy.firstName} {event.updatedBy.lastName}
                          </p>
                          <p className="text-md text-gray-500">{event.updatedBy.schoolEmail}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-md font-medium text-gray-900">
                            {event.createdBy.firstName} {event.createdBy.lastName}
                          </p>
                          <p className="text-md text-gray-500">{event.createdBy.schoolEmail}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Loader, Download, CheckCircle, XCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { getTicketOrder, getTicketDownloadUrl } from '@/hooks/tickets/use-tickets';
import { TicketProps } from '@/types/interfaces/ticket';

const TicketSuccessPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<{
    order: { status: string; buyerName: string; buyerEmail: string; amount: number };
    event: { title: string; location: string; date: string };
    tickets: TicketProps[];
  } | null>(null);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const fetchOrder = async () => {
      try {
        const data = await getTicketOrder(token);
        setOrderData(data);

        const images: Record<string, string> = {};
        for (const ticket of data.tickets) {
          images[ticket._id] = await QRCode.toDataURL(ticket.barcodePayload, {
            width: 200,
            margin: 1,
          });
        }
        setQrImages(images);
      } catch {
        setOrderData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="text-gray-600">Order not found or payment pending.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const { order, event, tickets } = orderData;
  const isPaid = order.status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {isPaid ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="text-gray-600 mt-2">Your ticket for {event.title}</p>
            </>
          ) : (
            <>
              <Loader className="h-16 w-16 text-amber-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900">Processing Payment...</h1>
              <p className="text-gray-600 mt-2">
                Your payment is being confirmed. Refresh this page in a moment.
              </p>
            </>
          )}
          {order.buyerEmail && isPaid && (
            <p className="text-sm text-gray-500 mt-2">
              A copy has been sent to {order.buyerEmail}
            </p>
          )}
        </div>

        {isPaid &&
          tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Ticket Number</p>
                  <p className="font-bold text-lg text-gray-900">{ticket.ticketNumber}</p>
                  <p className="text-sm text-gray-500 mt-3">Tier</p>
                  <p className="font-medium">{ticket.tierLabel}</p>
                  <p className="text-sm text-gray-500 mt-3">Holder</p>
                  <p className="font-medium">{ticket.holderName}</p>
                  <p className="text-sm text-gray-500 mt-3">Event</p>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                </div>

                {qrImages[ticket._id] && (
                  <div className="flex flex-col items-center">
                    <img
                      src={qrImages[ticket._id]}
                      alt="Ticket QR Code"
                      className="w-40 h-40 border border-gray-200 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Present at entrance
                    </p>
                  </div>
                )}
              </div>

              <a
                href={getTicketDownloadUrl(ticket._id, token as string)}
                className="mt-4 inline-flex items-center justify-center w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Ticket
              </a>
            </div>
          ))}

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccessPage;

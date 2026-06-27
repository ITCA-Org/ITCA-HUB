import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, Mail, Phone, Ticket, User, X } from 'lucide-react';
import { TicketProps } from '@/types/interfaces/ticket';
import { generateBarcodeDataUrl } from '@/utils/barcode';

interface TicketDetailsModalProps {
  ticket: TicketProps;
  onClose: () => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return 'Not recorded';
  return new Date(value).toLocaleString();
};

const TicketDetailsModal = ({ ticket, onClose }: TicketDetailsModalProps) => {
  const [barcodeUrl, setBarcodeUrl] = useState('');

  useEffect(() => {
    setBarcodeUrl(generateBarcodeDataUrl(ticket.barcode, 360, 110));
  }, [ticket.barcode]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
            <Ticket className="h-5 w-5 text-blue-600" />
            Ticket Details
          </h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-3 rounded-md bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-0.5 text-sm font-medium text-gray-950">
                {ticket.scanned ? 'Ticket scanned' : 'Ready for admission'}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                ticket.scanned ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {ticket.scanned ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {ticket.scanned ? 'Scanned' : 'Active'}
            </span>
          </div>

          <div className="grid gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              {ticket.attendeeName}
            </div>
            {ticket.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {ticket.email}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              {ticket.phoneNumber}
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-gray-400" />
              {ticket.ticketType} ticket
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              Issued: {formatDateTime(ticket.issuedAt)}
            </div>
            {ticket.scannedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Scanned: {formatDateTime(ticket.scannedAt)}
              </div>
            )}
          </div>

          <div className="rounded-md border border-gray-200 p-4">
            {barcodeUrl && (
              <Image
                src={barcodeUrl}
                alt={`Barcode for ${ticket.attendeeName}`}
                width={360}
                height={110}
                className="h-auto w-full"
                unoptimized
              />
            )}
            <p className="mt-2 text-center font-mono text-xs text-gray-500">{ticket.barcode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
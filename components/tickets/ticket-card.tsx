import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  Mail,
  Phone,
  ScanLine,
  Ticket,
  Trash2,
  User,
} from 'lucide-react';
import { TicketProps } from '@/types/interfaces/ticket';
import { generateBarcodeDataUrl } from '@/utils/barcode';

interface TicketCardProps {
  ticket: TicketProps;
  isAdmin?: boolean;
  onDelete?: (ticketId: string) => Promise<void> | void;
  onScan?: (barcode: string) => void;
  onViewDetails?: (ticket: TicketProps) => void;
}

const formatDate = (value?: string) => {
  if (!value) return 'Not recorded';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const getTypeStyles = (ticketType: TicketProps['ticketType']) => {
  if (ticketType === 'VIP') {
    return {
      header: 'border-amber-200 bg-amber-50 text-amber-800',
      badge: 'bg-amber-100 text-amber-800',
    };
  }

  return {
    header: 'border-blue-200 bg-blue-50 text-blue-800',
    badge: 'bg-blue-100 text-blue-800',
  };
};

const TicketCard = ({ ticket, isAdmin = false, onDelete, onScan, onViewDetails }: TicketCardProps) => {
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [showBarcode, setShowBarcode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const styles = getTypeStyles(ticket.ticketType);

  useEffect(() => {
    setBarcodeUrl(generateBarcodeDataUrl(ticket.barcode, 320, 92));
  }, [ticket.barcode]);

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmed = window.confirm(`Delete ticket for ${ticket.attendeeName}?`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await onDelete(ticket.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!barcodeUrl) return;

    const link = document.createElement('a');
    link.href = barcodeUrl;
    link.download = `${ticket.barcode}.png`;
    link.click();
  };

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`border-b px-5 py-4 ${styles.header}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide">{ticket.ticketType} Ticket</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-gray-950">{ticket.attendeeName}</h3>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              ticket.scanned ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-blue-700'
            }`}
          >
            {ticket.scanned ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
            {ticket.scanned ? 'Scanned' : 'Active'}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-gray-400" />
            <span className="truncate">{ticket.attendeeName}</span>
          </div>
          {ticket.email && (
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate">{ticket.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{ticket.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Ticket className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-xs">{ticket.barcode}</span>
          </div>
        </div>

        <div className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
          <div className="flex justify-between gap-3">
            <span>Issued</span>
            <span className="text-right font-medium text-gray-800">{formatDate(ticket.issuedAt)}</span>
          </div>
          {ticket.scannedAt && (
            <div className="mt-1 flex justify-between gap-3">
              <span>Scanned</span>
              <span className="text-right font-medium text-gray-800">{formatDate(ticket.scannedAt)}</span>
            </div>
          )}
        </div>

        {showBarcode && barcodeUrl && (
          <div className="rounded-md border border-gray-200 bg-white p-3">
            <Image
              src={barcodeUrl}
              alt={`Barcode for ${ticket.attendeeName}`}
              width={320}
              height={92}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-4 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => setShowBarcode((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Eye className="h-4 w-4" />
            {showBarcode ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!barcodeUrl}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Save
          </button>
          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(ticket)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <Ticket className="h-4 w-4" />
              Details
            </button>
          )}
          {isAdmin && onScan && !ticket.scanned && (
            <button
              type="button"
              onClick={() => onScan(ticket.barcode)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
            >
              <ScanLine className="h-4 w-4" />
              Scan
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? 'Deleting' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default TicketCard;
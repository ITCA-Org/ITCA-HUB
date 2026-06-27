import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, ScanLine, X } from 'lucide-react';
import { ScanResult } from '@/types/interfaces/ticket';

interface ScanTicketModalProps {
  initialBarcode?: string;
  onScan: (barcode: string) => Promise<ScanResult>;
  onClose: () => void;
}

const ScanTicketModal = ({ initialBarcode = '', onScan, onClose }: ScanTicketModalProps) => {
  const [barcode, setBarcode] = useState(initialBarcode);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async () => {
    const value = barcode.trim();
    if (!value) {
      setError('Enter a barcode to scan');
      return;
    }

    setIsScanning(true);
    setError('');
    setResult(null);
    try {
      setResult(await onScan(value));
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : 'Unable to scan this ticket');
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setBarcode('');
    setResult(null);
    setError('');
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-950">
            <ScanLine className="h-5 w-5 text-blue-600" />
            Scan Ticket
          </h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Barcode</label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleScan();
                }}
                className="min-w-0 flex-1 rounded-md border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Scan or enter barcode"
              />
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <ScanLine className="h-4 w-4" />
                {isScanning ? 'Scanning' : 'Scan'}
              </button>
            </div>
            {error && (
              <p className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          {result && (
            <div
              className={`rounded-md border p-4 ${
                result.valid ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div
                className={`mb-2 flex items-center gap-2 font-semibold ${
                  result.valid ? 'text-emerald-700' : 'text-red-700'
                }`}
              >
                {result.valid ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                {result.valid ? 'Valid ticket' : 'Invalid ticket'}
              </div>
              <p className="text-sm text-gray-700">{result.message}</p>
              <div className="mt-3 grid gap-1 text-sm text-gray-700">
                {result.attendee && <span>Attendee: {result.attendee}</span>}
                {result.event && <span>Event: {result.event}</span>}
                {result.ticketType && <span>Type: {result.ticketType}</span>}
                {result.scannedAt && <span>Scanned: {new Date(result.scannedAt).toLocaleString()}</span>}
                {result.alreadyScanned && <span className="font-medium text-amber-700">Already scanned</span>}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanTicketModal;
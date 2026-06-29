import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CheckCircle, XCircle, ScanLine, Keyboard } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import { verifyTicket } from '@/hooks/tickets/use-tickets';
import { VerifyTicketResult } from '@/types/interfaces/ticket';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { requireAdminAuth } from '@/utils/auth';

interface TicketScannerPageProps {
  userData: UserAuth;
}

const TicketScannerPage = ({ userData }: TicketScannerPageProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<VerifyTicketResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const handleVerify = async (barcodePayload: string) => {
    if (!barcodePayload.trim() || isVerifying) return;

    setIsVerifying(true);
    setResult(null);
    try {
      const data = await verifyTicket(barcodePayload.trim(), userData.token);
      setResult(data);
    } catch {
      setResult({ valid: false, message: 'Verification failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!scanning || !videoRef.current) return;

    const reader = new BrowserMultiFormatReader();

    reader
      .decodeFromVideoDevice(undefined, videoRef.current, (scanResult) => {
        if (scanResult) {
          handleVerify(scanResult.getText());
        }
      })
      .then((controls) => {
        controlsRef.current = controls;
      });

    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  return (
    <DashboardLayout token={userData.token}>
      <DashboardPageHeader
        title="Ticket Scanner"
        description="Scan QR codes to verify event tickets at the entrance"
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                setScanning(!scanning);
                setResult(null);
              }}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm ${
                scanning
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ScanLine className="h-4 w-4" />
              {scanning ? 'Stop Scanner' : 'Start Camera Scanner'}
            </button>
          </div>

          {scanning && (
            <div className="relative rounded-lg overflow-hidden bg-black aspect-video mb-4">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/50 rounded-lg" />
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Keyboard className="h-4 w-4" />
              Manual code entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Paste ticket barcode payload"
                className="flex-1 rounded-lg border border-gray-200 p-2.5 text-sm"
              />
              <button
                onClick={() => handleVerify(manualCode)}
                disabled={isVerifying}
                className="px-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {isVerifying && (
          <div className="text-center text-gray-500 py-4">Verifying ticket...</div>
        )}

        {result && (
          <div
            className={`rounded-xl border p-6 ${
              result.valid
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {result.valid ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p
                  className={`font-bold text-lg ${
                    result.valid ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {result.valid ? 'Valid Ticket' : result.message}
                </p>
                {result.ticket && (
                  <p className="text-sm text-gray-600">
                    {result.ticket.holderName} · {result.ticket.tierLabel}
                  </p>
                )}
              </div>
            </div>

            {result.ticket && (
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Ticket:</strong> {result.ticket.ticketNumber}
                </p>
                {result.usedAt && (
                  <p>
                    <strong>Used at:</strong>{' '}
                    {new Date(result.usedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TicketScannerPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};

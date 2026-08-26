import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { CheckCircle, XCircle, ScanLine, Keyboard } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import {
  verifyDuesReceipt,
  VerifyDuesResult,
} from '@/hooks/dues/use-dues';
import { formatFeeAmount } from '@/utils/fees';
import { UserAuth } from '@/types';
import { NextApiRequest } from 'next';
import { requireDuesStaffAuth } from '@/utils/auth';

interface DuesScannerPageProps {
  userData: UserAuth;
}

const DuesScannerPage = ({ userData }: DuesScannerPageProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [result, setResult] = useState<VerifyDuesResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lastScannedRef = useRef('');

  const handleVerify = async (qrPayload: string) => {
    if (!qrPayload.trim() || isVerifying) return;
    if (qrPayload.trim() === lastScannedRef.current && result) return;

    lastScannedRef.current = qrPayload.trim();
    setIsVerifying(true);
    setResult(null);
    try {
      const data = await verifyDuesReceipt(qrPayload.trim(), userData.token);
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
          void handleVerify(scanResult.getText());
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
    <DashboardLayout
      title="Dues Scanner"
      token={userData.token}
      role={userData.role}
    >
      <DashboardPageHeader
        title="Dues Scanner"
        description="Scan receipt QR codes to verify semester dues payment and eligibility"
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex gap-3">
            <button
              onClick={() => {
                setScanning(!scanning);
                setResult(null);
                lastScannedRef.current = '';
              }}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium ${
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
            <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black">
              <video ref={videoRef} className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-48 w-48 rounded-lg border-2 border-white/50" />
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Keyboard className="h-4 w-4" />
              Manual code entry
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Paste receipt QR payload or receipt number"
                className="flex-1 rounded-lg border border-gray-200 p-2.5 text-sm"
              />
              <button
                onClick={() => void handleVerify(manualCode)}
                disabled={isVerifying}
                className="rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50"
              >
                Verify
              </button>
            </div>
          </div>
        </div>

        {isVerifying && (
          <div className="py-4 text-center text-gray-500">Verifying receipt…</div>
        )}

        {result && (
          <div
            className={`rounded-xl border p-6 ${
              result.valid
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="mb-3 flex items-center gap-3">
              {result.valid ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <p
                  className={`text-lg font-bold ${
                    result.valid ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {result.valid ? 'Valid receipt' : result.message}
                </p>
                {result.receipt && (
                  <p className="text-sm text-gray-600">
                    {result.receipt.fullName} · {result.receipt.matricNumber}
                  </p>
                )}
              </div>
            </div>

            {result.receipt && (
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <strong>Receipt:</strong> {result.receipt.receiptNumber}
                </p>
                <p>
                  <strong>This payment:</strong>{' '}
                  {formatFeeAmount(result.receipt.amount)}
                </p>
                <p>
                  <strong>Total paid:</strong>{' '}
                  {formatFeeAmount(result.totalPaid ?? 0)} /{' '}
                  {formatFeeAmount(result.feeTotalRequired ?? 400)}
                </p>
                <p>
                  <strong>Balance:</strong>{' '}
                  <span
                    className={
                      (result.balanceRemaining ??
                        Math.max(
                          0,
                          (result.feeTotalRequired ?? 400) - (result.totalPaid ?? 0)
                        )) <= 0
                        ? 'font-semibold text-green-700'
                        : 'font-semibold text-amber-700'
                    }
                  >
                    {(result.balanceRemaining ??
                      Math.max(
                        0,
                        (result.feeTotalRequired ?? 400) - (result.totalPaid ?? 0)
                      )) <= 0
                      ? 'Full fee met'
                      : formatFeeAmount(
                          result.balanceRemaining ??
                            Math.max(
                              0,
                              (result.feeTotalRequired ?? 400) -
                                (result.totalPaid ?? 0)
                            )
                        )}
                  </span>
                </p>
                <p>
                  <strong>Eligibility:</strong>{' '}
                  <span
                    className={
                      result.auditEligible
                        ? 'font-semibold text-green-700'
                        : 'font-semibold text-amber-700'
                    }
                  >
                    {result.auditEligible ? 'Audit eligible' : 'Not yet eligible'}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DuesScannerPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireDuesStaffAuth(req);
};

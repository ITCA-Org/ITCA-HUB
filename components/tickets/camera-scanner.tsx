// CameraScanner.tsx
import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface CameraScannerProps {
  onDetected: (barcode: string) => void;
}

const CameraScanner = ({ onDetected }: CameraScannerProps) => {
  useEffect(() => {
    const scanner = new Html5Qrcode('camera-scanner');

    let active = true;

    const start = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) return;

        const cameraId = devices[0].id;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            if (!active) return;

            active = false;
            await scanner.stop();

            onDetected(decodedText);
          },
          () => {}
        );
      } catch (err) {
        console.error('Camera error:', err);
      }
    };

    start();

    return () => {
      active = false;
      scanner.stop().catch(() => {});
    };
  }, [onDetected]);

  return (
    <div className="w-full">
      <div
        id="camera-scanner"
        style={{ width: '100%', minHeight: 250 }}
      />
    </div>
  );
};

export default CameraScanner;
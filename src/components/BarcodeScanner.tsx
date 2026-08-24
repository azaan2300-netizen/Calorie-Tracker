import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
];

const SCANNER_ELEMENT_ID = 'barcode-scanner-view';

interface Props {
  active: boolean;
  onDetected: (barcode: string) => void;
  onCancel: () => void;
}

export default function BarcodeScanner({ active, onDetected, onCancel }: Props) {
  const [error, setError] = useState<string | null>(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    hasDetectedRef.current = false;
    let cancelled = false;
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
      formatsToSupport: BARCODE_FORMATS,
      verbose: false,
    });

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 280, height: 160 } },
        (decodedText) => {
          if (cancelled || hasDetectedRef.current) return;
          hasDetectedRef.current = true;
          onDetected(decodedText);
        },
        () => {
          // Per-frame decode misses are expected while the camera is aimed; ignore them.
        },
      )
      .catch((err) => {
        if (!cancelled) {
          setError(
            err?.message?.includes('Permission')
              ? 'Camera permission was denied. Allow camera access to scan a barcode.'
              : 'Could not start the camera on this device.',
          );
        }
      });

    return () => {
      cancelled = true;
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {
          // scanner may not have fully started before cleanup; safe to ignore
        });
    };
  }, [active, onDetected]);

  if (!active) return null;

  return (
    <div className="barcode-scanner">
      <div id={SCANNER_ELEMENT_ID} className="scanner-view" />
      {error && <p className="error">{error}</p>}
      <button type="button" className="secondary" onClick={onCancel}>
        Cancel scan
      </button>
    </div>
  );
}

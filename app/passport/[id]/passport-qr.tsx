"use client";

import QRCode from "react-qr-code";

/**
 * The only interactive-runtime dependency on the passport page. `react-qr-code`
 * uses forwardRef, which Server Components cannot render, so it is isolated
 * here — the rest of the passport ships no JavaScript.
 */
export function PassportQr({ value }: { value: string }) {
  return (
    <QRCode value={value} size={76} bgColor="#ffffff" fgColor="#0A172D" />
  );
}

import Image from "next/image";
import { BUSINESS } from "@/lib/business";

export default function CashAppPayment({ qrDataUrl }: { qrDataUrl: string }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.04)] text-center sm:flex-row sm:text-left">
      <Image
        src={qrDataUrl}
        alt="Cash App QR code"
        width={140}
        height={140}
        className="rounded-lg border border-gray-200"
        unoptimized
      />
      <div>
        <h3 className="text-[15px] font-semibold text-gray-900">Pay with Cash App</h3>
        <p className="mt-1 text-[14px] text-gray-500">
          Scan the code or tap the button below to pay {BUSINESS.cashtag} after your job is done.
        </p>
        <a
          href={BUSINESS.cashAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md bg-[#00d632] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Pay {BUSINESS.cashtag} on Cash App
        </a>
      </div>
    </div>
  );
}

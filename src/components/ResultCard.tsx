import React, { useState } from 'react';
import { FuelTripInput, FuelTripOutput } from '../types/fuel';
import { formatNumber, formatRupiah } from '../lib/formatters';
import { 
  Fuel, 
  BookmarkCheck, 
  Bookmark, 
  MessageCircle, 
  Copy, 
  Check, 
  Split 
} from 'lucide-react';
import { generateTripSummaryText, generateWhatsAppShareUrl, copyToClipboard } from '../lib/share';

interface ResultCardProps {
  input: FuelTripInput;
  output: FuelTripOutput | null;
  validationError?: string;
  onSaveToHistory: () => void;
  isSaved?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  input,
  output,
  validationError,
  onSaveToHistory,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    const text = generateTripSummaryText(input, output);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    if (!output) return;
    const text = generateTripSummaryText(input, output);
    const url = generateWhatsAppShareUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!output || validationError) {
    return (
      <div className="bg-slate-900/85 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/30 flex flex-col items-center justify-center text-center min-h-[380px] border border-white/10 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
          <Fuel className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold mb-2">Menunggu Input Perjalanan</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          {validationError || 'Lengkapi parameter jarak, konsumsi bahan bakar, dan harga BBM di sebelah kiri untuk melihat estimasi rincian biaya.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/85 backdrop-blur-md text-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/40 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Tag */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Estimasi Total Biaya
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            {input.isRoundTrip ? 'Pulang-Pergi (2x)' : 'Sekali Jalan'}
          </span>
        </div>

        {/* Primary Big Metric: Total IDR */}
        <div className="py-6 text-center sm:text-left">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Total Pengeluaran Bensin
          </span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mt-1 bg-gradient-to-r from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
            {formatRupiah(output.totalCostIdr)}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 justify-center sm:justify-start">
            <span>Jarak Efektif: <strong className="text-slate-200">{formatNumber(output.effectiveDistanceKm)} KM</strong></span>
            <span>•</span>
            <span>Rasio: <strong className="text-slate-200">{formatRupiah(output.costPerKmIdr)}/KM</strong></span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 my-2">
          {/* Total Liters */}
          <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Volume BBM</span>
              <Fuel className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {formatNumber(output.totalLiters, true)}
                <span className="text-xs font-bold text-slate-400 ml-1">Liter</span>
              </div>
              <span className="text-[11px] text-slate-400">Kapasitas dibutuhkan</span>
            </div>
          </div>

          {/* Split Cost / Passenger */}
          <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Biaya / Orang</span>
              <Split className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300">
                {formatRupiah(output.costPerPassengerIdr)}
              </div>
              <span className="text-[11px] text-slate-400">
                Bagi {input.passengerCount} Penumpang
              </span>
            </div>
          </div>
        </div>

        {/* Fuel & Vehicle Specs Summary */}
        {(input.vehicleName || input.fuelName) && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/50 backdrop-blur-md border border-white/10 text-xs text-slate-300 space-y-1">
            {input.vehicleName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Kendaraan:</span>
                <span className="font-semibold text-slate-200">{input.vehicleName}</span>
              </div>
            )}
            {input.fuelName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Jenis BBM:</span>
                <span className="font-semibold text-slate-200">{input.fuelName}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Kirim ke WhatsApp</span>
          </button>

          {/* Copy Text Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all border border-white/10 active:scale-[0.98] cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Rincian Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Rincian</span>
              </>
            )}
          </button>
        </div>

        {/* Save to History Button */}
        <button
          type="button"
          onClick={onSaveToHistory}
          disabled={isSaved}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
            isSaved
              ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300 cursor-default'
              : 'bg-slate-950/60 border-white/10 text-slate-300 hover:text-white hover:border-white/20 cursor-pointer'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>Tersimpan di Riwayat</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Simpan ke Riwayat Komputasi</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

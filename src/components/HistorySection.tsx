import React from 'react';
import { CalculationRecord } from '../types/fuel';
import { formatNumber, formatRupiah, formatTripDate } from '../lib/formatters';
import { History, Trash2, ArrowUpRight, Clock } from 'lucide-react';

interface HistorySectionProps {
  history: CalculationRecord[];
  onRestore: (record: CalculationRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onRestore,
  onDelete,
  onClearAll,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/20 border border-white/10 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">
              Riwayat Perhitungan Tersimpan
            </h3>
            <p className="text-xs text-slate-400">
              5 perhitungan terakhir tersimpan di browser Anda
            </p>
          </div>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-500/30"
        >
          Hapus Semua
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {history.map((record) => (
          <div
            key={record.id}
            className="p-4 rounded-2xl border border-white/10 bg-slate-950/60 backdrop-blur-md hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {record.title || 'Perjalanan Tanpa Nama'}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatTripDate(record.createdAt)}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-300">
                      {record.input.isRoundTrip ? 'PP' : 'One-Way'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDelete(record.id)}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
                  title="Hapus riwayat ini"
                  aria-label="Delete history item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Metrics Summary */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs py-2 px-2.5 rounded-xl bg-slate-900/80 border border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 block">Jarak</span>
                  <span className="font-bold text-slate-200">
                    {formatNumber(record.output.effectiveDistanceKm)} km
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Bensin</span>
                  <span className="font-bold text-slate-200">
                    {formatNumber(record.output.totalLiters, true)} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Total</span>
                  <span className="font-bold text-emerald-400">
                    {formatRupiah(record.output.totalCostIdr)}
                  </span>
                </div>
              </div>
            </div>

            {/* Restore CTA */}
            <div className="mt-3 pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-[11px] text-slate-400">
                {record.input.passengerCount > 1
                  ? `${record.input.passengerCount} orang (${formatRupiah(record.output.costPerPassengerIdr)}/org)`
                  : '1 Pengendara'}
              </span>

              <button
                onClick={() => onRestore(record)}
                className="flex items-center space-x-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>Gunakan Data</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

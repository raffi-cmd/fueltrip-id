import React, { useState } from 'react';
import { X, MapPin, Navigation, Clock, CreditCard, ArrowRight, Search } from 'lucide-react';
import { POPULAR_ROUTES } from '../data/popularRoutes';
import { PopularRoute } from '../types/fuel';
import { formatNumber, formatRupiah } from '../lib/formatters';

interface PopularRoutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoute: (route: PopularRoute) => void;
}

export const PopularRoutesModal: React.FC<PopularRoutesModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredRoutes = POPULAR_ROUTES.filter((r) => {
    const matchesCat = activeCategory === 'all' || r.category === activeCategory;
    const matchesSearch =
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[88vh] overflow-hidden text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="routes-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 id="routes-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Pilih Rute Populer & Mudik Indonesia
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik rute untuk mengisi otomatis estimasi jarak kilometer perjalanan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="px-6 pt-4 pb-2 space-y-3 bg-slate-950/50 border-b border-white/10">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari rute (Semarang, Solo, Surabaya, Lampung, Bandung)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900/80 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua Rute' },
              { id: 'mudik_jawa', label: 'Tol Trans Jawa' },
              { id: 'mudik_sumatera', label: 'Trans Sumatera' },
              { id: 'komuter', label: 'Komuter Jabodetabek' },
              { id: 'wisata', label: 'Wisata & Regional' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-800/80 text-slate-300 border border-white/10 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-white/10">
          {filteredRoutes.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>Tidak ada rute yang cocok dengan pencarian.</p>
            </div>
          ) : (
            filteredRoutes.map((route) => (
              <div
                key={route.id}
                onClick={() => {
                  onSelectRoute(route);
                  onClose();
                }}
                className="pt-3 first:pt-0 group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-emerald-500/50 hover:bg-emerald-950/30"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mt-0.5">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {route.origin}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {route.destination}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        ~{route.estimatedHours} Jam
                      </span>
                      {route.tollEstimateIdr && (
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <CreditCard className="w-3 h-3" />
                          Tol: {formatRupiah(route.tollEstimateIdr)}
                        </span>
                      )}
                      <span className="bg-slate-800/80 px-1.5 py-0.5 rounded text-[10px] font-semibold text-slate-300 border border-white/10">
                        {route.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right pl-4">
                  <span className="text-base font-extrabold text-emerald-400">
                    {formatNumber(route.distanceKm)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1">KM</span>
                  <p className="text-[10px] text-slate-500">Sekali jalan</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>* Estimasi tarif tol berdasarkan golongan 1 (mobil pribadi / sedan).</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

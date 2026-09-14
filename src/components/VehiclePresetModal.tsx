import React, { useState } from 'react';
import { X, Car, Bike, Gauge, Check, Search } from 'lucide-react';
import { VEHICLE_PRESETS } from '../data/presets';
import { VehiclePreset } from '../types/fuel';

interface VehiclePresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (preset: VehiclePreset) => void;
  selectedVehicleId?: string;
}

export const VehiclePresetModal: React.FC<VehiclePresetModalProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
  selectedVehicleId,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredPresets = VEHICLE_PRESETS.filter((preset) => {
    const matchesTab = activeTab === 'all' || preset.category === activeTab;
    const matchesSearch =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 id="vehicle-modal-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-500" />
              Pilih Preset Kendaraan Indonesia
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pilih spesifikasi rata-rata efisiensi BBM (km/liter) sesuai jenis kendaraan Anda.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="px-6 pt-4 pb-2 space-y-3 bg-slate-50/70 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kendaraan (Avanza, Brio, NMAX, BeAT, Innova)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'motorcycle', label: 'Motor' },
              { id: 'city_car', label: 'LCGC & City Car' },
              { id: 'mpv', label: 'MPV Keluarga' },
              { id: 'suv', label: 'SUV' },
              { id: 'diesel', label: 'Diesel' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredPresets.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>Tidak ada kendaraan yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            filteredPresets.map((preset) => {
              const isSelected = selectedVehicleId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectVehicle(preset);
                    onClose();
                  }}
                  className={`pt-3 first:pt-0 group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-sm'
                      : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${
                        preset.iconType === 'bike'
                          ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400'
                          : preset.category === 'diesel'
                          ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {preset.iconType === 'bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {preset.name}
                        </h4>
                        {isSelected && (
                          <span className="flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                            <Check className="w-3 h-3 mr-0.5" /> Dipilih
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right pl-4">
                    <div className="flex items-center justify-end space-x-1 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                      <Gauge className="w-4 h-4" />
                      <span>{preset.avgKmPerLiter}</span>
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">km/L</span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                      {preset.categoryLabel}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>* Konsumsi nyata dapat berbeda tergantung gaya berkendara dan kondisi lalu lintas.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

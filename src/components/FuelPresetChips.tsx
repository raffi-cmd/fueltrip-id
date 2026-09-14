import React, { useState } from 'react';
import { FUEL_PRESETS } from '../data/presets';
import { FuelPreset, FuelBrand } from '../types/fuel';
import { formatRupiah } from '../lib/formatters';
import { Fuel } from 'lucide-react';

interface FuelPresetChipsProps {
  onSelectFuel: (preset: FuelPreset) => void;
  selectedPrice: number;
  selectedFuelId?: string;
}

export const FuelPresetChips: React.FC<FuelPresetChipsProps> = ({
  onSelectFuel,
  selectedPrice,
  selectedFuelId,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<FuelBrand | 'all'>('Pertamina');

  const brands: (FuelBrand | 'all')[] = ['Pertamina', 'Shell', 'BP', 'Vivo', 'all'];

  const displayedFuels = FUEL_PRESETS.filter(
    (f) => selectedBrand === 'all' || f.brand === selectedBrand
  );

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
          <Fuel className="w-3.5 h-3.5 text-emerald-500" />
          Pilihan Cepat Jenis BBM
        </label>
        
        {/* Brand Tabs */}
        <div className="flex space-x-1">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                selectedBrand === brand
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {brand === 'all' ? 'Semua' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {displayedFuels.map((fuel) => {
          const isSelected = selectedFuelId === fuel.id || selectedPrice === fuel.pricePerLiter;
          return (
            <button
              key={fuel.id}
              type="button"
              onClick={() => onSelectFuel(fuel)}
              className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${fuel.colorTag}`} />
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {fuel.name}
                  </span>
                </div>
                {fuel.ron && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1 rounded">
                    {fuel.ron}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline justify-between w-full">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {formatRupiah(fuel.pricePerLiter)}
                </span>
                <span className="text-[10px] text-slate-400">/liter</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

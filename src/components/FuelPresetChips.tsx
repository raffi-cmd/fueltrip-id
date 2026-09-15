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
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
          <Fuel className="w-3.5 h-3.5 text-emerald-400" />
          Pilihan Cepat Jenis BBM
        </label>
        
        {/* Brand Tabs */}
        <div className="flex space-x-1">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setSelectedBrand(brand)}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-950/40 hover:bg-slate-800'
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
              className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-400/30 shadow-md shadow-emerald-500/20'
                  : 'border-white/10 hover:border-emerald-500/40 bg-slate-950/60 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${fuel.colorTag} shadow-sm`} />
                  <span className="font-semibold text-xs text-slate-200 truncate">
                    {fuel.name}
                  </span>
                </div>
                {fuel.ron && (
                  <span className="text-[10px] text-slate-400 font-medium bg-slate-900 px-1 py-0.5 rounded border border-white/5">
                    {fuel.ron}
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-baseline justify-between w-full">
                <span className="text-xs font-bold text-emerald-400">
                  {formatRupiah(fuel.pricePerLiter)}
                </span>
                <span className="text-[10px] text-slate-500">/liter</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

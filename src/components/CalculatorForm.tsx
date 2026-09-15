import React, { useState } from 'react';
import { FuelTripInput, FuelPreset } from '../types/fuel';
import { FuelPresetChips } from './FuelPresetChips';
import { 
  MapPin, 
  Gauge, 
  Car, 
  Repeat, 
  Users, 
  Plus, 
  Minus, 
  Tag, 
  Sparkles
} from 'lucide-react';

interface CalculatorFormProps {
  input: FuelTripInput;
  onChange: (updated: Partial<FuelTripInput>) => void;
  onOpenVehicleModal: () => void;
  onOpenRoutesModal: () => void;
  errorField?: keyof FuelTripInput;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  input,
  onChange,
  onOpenVehicleModal,
  onOpenRoutesModal,
  errorField,
}) => {
  const [distanceRaw, setDistanceRaw] = useState<string>(input.distanceKm > 0 ? String(input.distanceKm) : '');
  const [consumptionRaw, setConsumptionRaw] = useState<string>(input.fuelConsumptionKmPerL > 0 ? String(input.fuelConsumptionKmPerL) : '');
  const [priceRaw, setPriceRaw] = useState<string>(input.fuelPricePerLiter > 0 ? String(input.fuelPricePerLiter) : '');

  React.useEffect(() => {
    setDistanceRaw(input.distanceKm > 0 ? String(input.distanceKm) : '');
  }, [input.distanceKm]);

  React.useEffect(() => {
    setConsumptionRaw(input.fuelConsumptionKmPerL > 0 ? String(input.fuelConsumptionKmPerL) : '');
  }, [input.fuelConsumptionKmPerL]);

  React.useEffect(() => {
    setPriceRaw(input.fuelPricePerLiter > 0 ? String(input.fuelPricePerLiter) : '');
  }, [input.fuelPricePerLiter]);

  const handleDistanceChange = (val: string) => {
    setDistanceRaw(val);
    const cleaned = val.replace(',', '.');
    const num = parseFloat(cleaned);
    onChange({ distanceKm: isNaN(num) ? 0 : Math.max(0, num) });
  };

  const handleAddDistance = (km: number) => {
    const current = input.distanceKm || 0;
    const next = current + km;
    onChange({ distanceKm: next });
    setDistanceRaw(String(next));
  };

  const handleConsumptionChange = (val: string) => {
    setConsumptionRaw(val);
    const cleaned = val.replace(',', '.');
    const num = parseFloat(cleaned);
    onChange({ fuelConsumptionKmPerL: isNaN(num) ? 0 : Math.max(0, num), vehicleName: undefined });
  };

  const handlePriceChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, '');
    setPriceRaw(cleanDigits);
    const num = parseInt(cleanDigits, 10);
    onChange({ fuelPricePerLiter: isNaN(num) ? 0 : Math.max(0, num), fuelName: undefined });
  };

  const handleSelectFuel = (preset: FuelPreset) => {
    onChange({
      fuelPricePerLiter: preset.pricePerLiter,
      fuelName: `${preset.brand} ${preset.name}`,
    });
    setPriceRaw(String(preset.pricePerLiter));
  };

  const incrementPassenger = () => {
    if (input.passengerCount < 10) {
      onChange({ passengerCount: input.passengerCount + 1 });
    }
  };

  const decrementPassenger = () => {
    if (input.passengerCount > 1) {
      onChange({ passengerCount: input.passengerCount - 1 });
    }
  };

  return (
    <div className="backdrop-blur-md bg-slate-900/85 text-slate-100 rounded-3xl p-5 sm:p-7 shadow-2xl border border-white/10 hover:border-emerald-500/30 transition-all space-y-6">
      
      {/* Optional Trip Name */}
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" />
          Nama Perjalanan / Catatan (Opsional)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Contoh: Mudik Solo 2026, Liburan Bandung, Komuter Kantor..."
            value={input.tripName || ''}
            onChange={(e) => onChange({ tripName: e.target.value })}
            className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-white placeholder-slate-500 transition-all"
          />
        </div>
      </div>

      {/* Field 1: Distance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            1. Jarak Tempuh Sekali Jalan
          </label>
          <button
            type="button"
            onClick={onOpenRoutesModal}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pilih Rute Populer
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={distanceRaw}
            onChange={(e) => handleDistanceChange(e.target.value)}
            className={`w-full text-xl sm:text-2xl font-black px-4 py-3.5 rounded-2xl bg-slate-950/70 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
              errorField === 'distanceKm'
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-white/10 focus:ring-emerald-500/40 focus:border-emerald-400'
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-emerald-400/80 text-sm sm:text-base">
            KM
          </div>
        </div>

        {/* Quick Add Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Cepat:</span>
          {[25, 50, 100, 250, 500].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => handleAddDistance(km)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 hover:text-emerald-300 text-slate-300 border border-white/5 transition-all cursor-pointer"
            >
              +{km} km
            </button>
          ))}
          {input.distanceKm > 0 && (
            <button
              type="button"
              onClick={() => {
                onChange({ distanceKm: 0 });
                setDistanceRaw('');
              }}
              className="px-2 py-1 text-xs text-red-400 hover:bg-red-950/40 rounded-lg transition-colors ml-auto cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Field 2: Fuel Consumption */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-emerald-400" />
            2. Konsumsi Bahan Bakar (Efisiensi)
          </label>
          <button
            type="button"
            onClick={onOpenVehicleModal}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Car className="w-3.5 h-3.5" />
            Preset Kendaraan
          </button>
        </div>

        {input.vehicleName && (
          <div className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-sm">
            <span className="font-semibold flex items-center gap-1.5 truncate">
              <Car className="w-3.5 h-3.5 shrink-0" />
              {input.vehicleName}
            </span>
            <button
              type="button"
              onClick={() => onChange({ vehicleName: undefined })}
              className="text-[11px] underline text-emerald-400 ml-2 hover:opacity-80 cursor-pointer"
            >
              Ubah
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Contoh: 14.5"
            value={consumptionRaw}
            onChange={(e) => handleConsumptionChange(e.target.value)}
            className={`w-full text-xl sm:text-2xl font-black px-4 py-3.5 rounded-2xl bg-slate-950/70 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
              errorField === 'fuelConsumptionKmPerL'
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-white/10 focus:ring-emerald-500/40 focus:border-emerald-400'
            }`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 font-extrabold text-emerald-400/80 text-sm sm:text-base">
            KM / Liter
          </div>
        </div>
      </div>

      {/* Field 3: Fuel Price */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-emerald-400" />
            3. Harga Bahan Bakar per Liter
          </label>
          {input.fuelName && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
              {input.fuelName}
            </span>
          )}
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-emerald-400/80 text-base sm:text-lg">
            Rp
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="10000"
            value={priceRaw ? parseInt(priceRaw, 10).toLocaleString('id-ID') : ''}
            onChange={(e) => handlePriceChange(e.target.value)}
            className={`w-full text-xl sm:text-2xl font-black pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/70 border text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
              errorField === 'fuelPricePerLiter'
                ? 'border-red-500 focus:ring-red-500/30'
                : 'border-white/10 focus:ring-emerald-500/40 focus:border-emerald-400'
            }`}
          />
        </div>

        {/* Quick Fuel Preset Chips */}
        <FuelPresetChips
          onSelectFuel={handleSelectFuel}
          selectedPrice={input.fuelPricePerLiter}
        />
      </div>

      {/* Field 4 & 5: Trip Options (Round-Trip Toggle & Passenger Stepper) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
        
        {/* Round Trip Switch */}
        <div
          onClick={() => onChange({ isRoundTrip: !input.isRoundTrip })}
          className={`p-4 rounded-2xl border cursor-pointer select-none transition-all flex items-center justify-between ${
            input.isRoundTrip
              ? 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/30'
              : 'border-white/10 hover:border-white/20 bg-slate-950/50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                input.isRoundTrip
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">
                {input.isRoundTrip ? 'Pulang - Pergi (PP)' : 'Sekali Jalan'}
              </p>
              <p className="text-xs text-slate-400">
                {input.isRoundTrip ? 'Otomatis x2 jarak' : '1x jarak rute'}
              </p>
            </div>
          </div>

          <div
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              input.isRoundTrip ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                input.isRoundTrip ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>

        {/* Passenger Counter */}
        <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">
                Jumlah Penumpang
              </p>
              <p className="text-xs text-slate-400">
                Bagi rata biaya (Split cost)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={decrementPassenger}
              disabled={input.passengerCount <= 1}
              className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Kurang penumpang"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-black text-base text-emerald-300">
              {input.passengerCount}
            </span>
            <button
              type="button"
              onClick={incrementPassenger}
              disabled={input.passengerCount >= 10}
              className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
              aria-label="Tambah penumpang"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

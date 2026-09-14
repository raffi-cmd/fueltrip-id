import React, { useState, useMemo } from 'react';
import { FuelTripInput, VehiclePreset, PopularRoute, CalculationRecord } from './types/fuel';
import { safeCalculateFuelTrip } from './lib/calculator';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultCard } from './components/ResultCard';
import { VehiclePresetModal } from './components/VehiclePresetModal';
import { PopularRoutesModal } from './components/PopularRoutesModal';
import { HistorySection } from './components/HistorySection';
import { Sparkles, Lightbulb } from 'lucide-react';

const DEFAULT_INPUT: FuelTripInput = {
  distanceKm: 150,
  fuelConsumptionKmPerL: 13.5,
  fuelPricePerLiter: 10000,
  isRoundTrip: false,
  passengerCount: 1,
  tripName: 'Jakarta - Bandung',
  vehicleName: 'Mobil LMPV 1.5L (Avanza / Xenia / Xpander)',
  fuelName: 'Pertamina Pertalite',
};

export const App: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [input, setInput] = useState<FuelTripInput>(DEFAULT_INPUT);
  const [history, setHistory] = useLocalStorage<CalculationRecord[]>('fueltrip_history', []);
  
  // Modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isRoutesModalOpen, setIsRoutesModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reactive calculation computation
  const { result: calculationResult, error: validationError, errorField } = useMemo(() => {
    return safeCalculateFuelTrip(input);
  }, [input]);

  const handleInputChange = (updated: Partial<FuelTripInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
    setSavedSuccess(false);
  };

  const handleSelectVehicle = (preset: VehiclePreset) => {
    handleInputChange({
      fuelConsumptionKmPerL: preset.avgKmPerLiter,
      vehicleName: preset.name,
    });
  };

  const handleSelectRoute = (route: PopularRoute) => {
    handleInputChange({
      distanceKm: route.distanceKm,
      tripName: `${route.origin} ke ${route.destination}`,
    });
  };

  const handleReset = () => {
    setInput({
      distanceKm: 0,
      fuelConsumptionKmPerL: 0,
      fuelPricePerLiter: 10000,
      isRoundTrip: false,
      passengerCount: 1,
      tripName: '',
      vehicleName: undefined,
      fuelName: 'Pertamina Pertalite',
    });
    setSavedSuccess(false);
  };

  const handleSaveToHistory = () => {
    if (!calculationResult) return;

    const newRecord: CalculationRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      title: input.tripName || `Perjalanan ${input.distanceKm} km`,
      input: { ...input },
      output: { ...calculationResult },
    };

    // Keep only last 5 records
    setHistory((prev) => [newRecord, ...prev.filter((item) => item.id !== newRecord.id)].slice(0, 5));
    setSavedSuccess(true);
  };

  const handleRestoreRecord = (record: CalculationRecord) => {
    setInput({ ...record.input });
    setSavedSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        onReset={handleReset}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenPopularRoutes={() => setIsRoutesModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Hero Section */}
        <section className="text-center sm:text-left max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Kalkulator Bahan Bakar & Mudik Idul Fitri 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Hitung Estimasi Biaya Bensin & Mudik dengan Presisi
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Masukkan jarak, pilih preset kendaraan atau jenis BBM terkini, dan dapatkan rincian liter serta pembagian biaya per penumpang secara instan.
          </p>
        </section>

        {/* Core 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Form Inputs (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <CalculatorForm
              input={input}
              onChange={handleInputChange}
              onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
              onOpenRoutesModal={() => setIsRoutesModalOpen(true)}
              errorField={errorField}
            />
          </div>

          {/* Right Column: Live Result Card (5 cols on desktop, sticky on large screens) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <ResultCard
              input={input}
              output={calculationResult}
              validationError={validationError}
              onSaveToHistory={handleSaveToHistory}
              isSaved={savedSuccess}
            />

            {/* Quick Tips Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Tips Hemat Bensin Saat Mudik:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                <li>Jaga kecepatan konstan 80-100 km/jam di jalan tol.</li>
                <li>Pastikan tekanan ban sesuai rekomendasi pabrikan.</li>
                <li>Hindari akselerasi mendadak & bawa muatan tidak melebihi batas.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Computation History */}
        <HistorySection
          history={history}
          onRestore={handleRestoreRecord}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAllHistory}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            FuelTrip ID • Kalkulator Biaya Operasional Kendaraan & Mudik Indonesia.
          </p>
          <p className="text-[11px] text-slate-400">
            Dibuat untuk mempermudah budgeting perjalanan tanpa memerlukan koneksi server (100% Client-side).
          </p>
        </div>
      </footer>

      {/* Modals */}
      <VehiclePresetModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSelectVehicle={handleSelectVehicle}
      />

      <PopularRoutesModal
        isOpen={isRoutesModalOpen}
        onClose={() => setIsRoutesModalOpen(false)}
        onSelectRoute={handleSelectRoute}
      />
    </div>
  );
};

export default App;

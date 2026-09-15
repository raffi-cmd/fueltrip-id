import React from 'react';
import { Fuel, Moon, Sun, RotateCcw, MapPin } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenPopularRoutes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  isDark,
  onToggleTheme,
  onOpenPopularRoutes,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30">
            <Fuel className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                FuelTrip
              </span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                ID • 3D
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Kalkulator BBM & Estimasi Perjalanan Indonesia
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenPopularRoutes}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20 backdrop-blur-md"
            title="Pilih Rute Mudik Trans Jawa / Sumatera"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Rute Populer</span>
            <span className="inline sm:hidden">Rute</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 transition-colors cursor-pointer"
            title="Reset Form Kalkulasi"
            aria-label="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 transition-colors cursor-pointer"
            title={isDark ? 'Mode Gelap Aktif' : 'Ganti Tema'}
            aria-label="Toggle theme"
          >
            {isDark ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

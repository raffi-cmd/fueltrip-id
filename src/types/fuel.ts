export interface FuelTripInput {
  distanceKm: number;
  fuelConsumptionKmPerL: number;
  fuelPricePerLiter: number;
  isRoundTrip: boolean;
  passengerCount: number;
  tripName?: string;
  vehicleName?: string;
  fuelName?: string;
}

export interface FuelTripOutput {
  effectiveDistanceKm: number;
  totalLiters: number;
  totalCostIdr: number;
  costPerKmIdr: number;
  costPerPassengerIdr: number;
  timestamp: number;
}

export type VehicleCategory = 'motorcycle' | 'city_car' | 'mpv' | 'suv' | 'diesel' | 'truck';

export interface VehiclePreset {
  id: string;
  name: string;
  category: VehicleCategory;
  categoryLabel: string;
  avgKmPerLiter: number;
  description: string;
  iconType: 'bike' | 'car' | 'suv' | 'truck';
}

export type FuelBrand = 'Pertamina' | 'Shell' | 'BP' | 'Vivo';

export interface FuelPreset {
  id: string;
  brand: FuelBrand;
  name: string;
  pricePerLiter: number;
  ron?: string;
  type: 'gasoline' | 'diesel';
  colorTag: string;
}

export interface CalculationRecord {
  id: string;
  createdAt: string;
  title: string;
  input: FuelTripInput;
  output: FuelTripOutput;
}

export interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  category: 'mudik_jawa' | 'mudik_sumatera' | 'komuter' | 'wisata';
  categoryLabel: string;
  estimatedHours: number;
  tollEstimateIdr?: number;
}

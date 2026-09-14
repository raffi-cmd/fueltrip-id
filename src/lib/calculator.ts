import { FuelTripInput, FuelTripOutput } from '../types/fuel';

export class CalculatorValidationError extends Error {
  constructor(public field: keyof FuelTripInput, message: string) {
    super(message);
    this.name = 'CalculatorValidationError';
  }
}

/**
 * Validates raw trip inputs strictly according to functional requirements.
 */
export function validateFuelTripInput(input: Partial<FuelTripInput>): void {
  if (input.distanceKm === undefined || isNaN(input.distanceKm) || input.distanceKm <= 0) {
    throw new CalculatorValidationError('distanceKm', 'Jarak tempuh harus lebih besar dari 0 km');
  }
  if (input.fuelConsumptionKmPerL === undefined || isNaN(input.fuelConsumptionKmPerL) || input.fuelConsumptionKmPerL <= 0) {
    throw new CalculatorValidationError('fuelConsumptionKmPerL', 'Konsumsi BBM harus lebih besar dari 0 km/liter');
  }
  if (input.fuelPricePerLiter === undefined || isNaN(input.fuelPricePerLiter) || input.fuelPricePerLiter <= 0) {
    throw new CalculatorValidationError('fuelPricePerLiter', 'Harga BBM per liter harus lebih besar dari Rp 0');
  }
}

/**
 * Pure calculation engine for FuelTrip ID.
 * Computes required fuel in liters and IDR budget deterministically.
 */
export function calculateFuelTrip(input: FuelTripInput): FuelTripOutput {
  validateFuelTripInput(input);

  const multiplier = input.isRoundTrip ? 2 : 1;
  const effectiveDistanceKm = Number((input.distanceKm * multiplier).toFixed(2));
  const rawTotalLiters = effectiveDistanceKm / input.fuelConsumptionKmPerL;
  const totalLiters = Number(rawTotalLiters.toFixed(2));
  const rawTotalCost = rawTotalLiters * input.fuelPricePerLiter;
  const totalCostIdr = Math.round(rawTotalCost);

  const passengerCount = Math.max(1, Math.floor(input.passengerCount || 1));
  const costPerKmIdr = effectiveDistanceKm > 0 ? Math.round(totalCostIdr / effectiveDistanceKm) : 0;
  const costPerPassengerIdr = Math.round(totalCostIdr / passengerCount);

  return {
    effectiveDistanceKm,
    totalLiters,
    totalCostIdr,
    costPerKmIdr,
    costPerPassengerIdr,
    timestamp: Date.now()
  };
}

/**
 * Safe wrapper for live reactive UI updates.
 * Returns null or fallback when inputs are incomplete or zero without crashing UI.
 */
export function safeCalculateFuelTrip(input: Partial<FuelTripInput>): {
  result: FuelTripOutput | null;
  error?: string;
  errorField?: keyof FuelTripInput;
} {
  try {
    if (!input.distanceKm || input.distanceKm <= 0) {
      return { result: null, error: 'Masukkan jarak tempuh (> 0 km)', errorField: 'distanceKm' };
    }
    if (!input.fuelConsumptionKmPerL || input.fuelConsumptionKmPerL <= 0) {
      return { result: null, error: 'Masukkan efisiensi kendaraan (> 0 km/L)', errorField: 'fuelConsumptionKmPerL' };
    }
    if (!input.fuelPricePerLiter || input.fuelPricePerLiter <= 0) {
      return { result: null, error: 'Masukkan harga BBM per liter (> Rp 0)', errorField: 'fuelPricePerLiter' };
    }

    const fullInput: FuelTripInput = {
      distanceKm: input.distanceKm,
      fuelConsumptionKmPerL: input.fuelConsumptionKmPerL,
      fuelPricePerLiter: input.fuelPricePerLiter,
      isRoundTrip: Boolean(input.isRoundTrip),
      passengerCount: Math.max(1, input.passengerCount ?? 1),
      tripName: input.tripName,
      vehicleName: input.vehicleName,
      fuelName: input.fuelName
    };

    const result = calculateFuelTrip(fullInput);
    return { result };
  } catch (err) {
    if (err instanceof CalculatorValidationError) {
      return { result: null, error: err.message, errorField: err.field };
    }
    return { result: null, error: (err as Error).message };
  }
}

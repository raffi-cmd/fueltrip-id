import { describe, it, expect } from 'vitest';
import {
  calculateFuelTrip,
  safeCalculateFuelTrip,
  CalculatorValidationError,
} from './calculator';
import { FuelTripInput } from '../types/fuel';

describe('Fuel Calculator Engine (calculateFuelTrip)', () => {
  it('U-01: Standard One-Way Trip Calculation', () => {
    const input: FuelTripInput = {
      distanceKm: 100,
      fuelConsumptionKmPerL: 10,
      fuelPricePerLiter: 10000,
      isRoundTrip: false,
      passengerCount: 1,
    };

    const result = calculateFuelTrip(input);

    expect(result.effectiveDistanceKm).toBe(100);
    expect(result.totalLiters).toBe(10.00);
    expect(result.totalCostIdr).toBe(100000);
    expect(result.costPerKmIdr).toBe(1000);
    expect(result.costPerPassengerIdr).toBe(100000);
  });

  it('U-02: Round Trip Multiplier (2x) Calculation', () => {
    const input: FuelTripInput = {
      distanceKm: 250,
      fuelConsumptionKmPerL: 12.5,
      fuelPricePerLiter: 13500,
      isRoundTrip: true,
      passengerCount: 1,
    };

    const result = calculateFuelTrip(input);

    expect(result.effectiveDistanceKm).toBe(500);
    expect(result.totalLiters).toBe(40.00);
    expect(result.totalCostIdr).toBe(540000);
    expect(result.costPerKmIdr).toBe(1080);
    expect(result.costPerPassengerIdr).toBe(540000);
  });

  it('U-03: Split Cost / Multi-Passenger Distribution', () => {
    const input: FuelTripInput = {
      distanceKm: 500,
      fuelConsumptionKmPerL: 12,
      fuelPricePerLiter: 14400,
      isRoundTrip: false,
      passengerCount: 4,
    };

    const result = calculateFuelTrip(input);

    expect(result.effectiveDistanceKm).toBe(500);
    expect(result.totalLiters).toBe(41.67);
    expect(result.totalCostIdr).toBe(600000);
    expect(result.costPerPassengerIdr).toBe(150000);
  });

  it('U-04: Prevents Divide-by-Zero and Rejects Negative/Zero Inputs', () => {
    expect(() =>
      calculateFuelTrip({
        distanceKm: 0,
        fuelConsumptionKmPerL: 10,
        fuelPricePerLiter: 10000,
        isRoundTrip: false,
        passengerCount: 1,
      })
    ).toThrow(CalculatorValidationError);

    expect(() =>
      calculateFuelTrip({
        distanceKm: 100,
        fuelConsumptionKmPerL: 0,
        fuelPricePerLiter: 10000,
        isRoundTrip: false,
        passengerCount: 1,
      })
    ).toThrow(CalculatorValidationError);

    expect(() =>
      calculateFuelTrip({
        distanceKm: 100,
        fuelConsumptionKmPerL: -5,
        fuelPricePerLiter: 10000,
        isRoundTrip: false,
        passengerCount: 1,
      })
    ).toThrow(CalculatorValidationError);

    expect(() =>
      calculateFuelTrip({
        distanceKm: 100,
        fuelConsumptionKmPerL: 10,
        fuelPricePerLiter: 0,
        isRoundTrip: false,
        passengerCount: 1,
      })
    ).toThrow(CalculatorValidationError);
  });

  it('Handles user persona Budi: 500 km, 12 km/L, Rp 13.700', () => {
    const input: FuelTripInput = {
      distanceKm: 500,
      fuelConsumptionKmPerL: 12,
      fuelPricePerLiter: 13700,
      isRoundTrip: false,
      passengerCount: 1,
    };

    const result = calculateFuelTrip(input);
    expect(result.totalLiters).toBe(41.67);
    expect(result.totalCostIdr).toBe(570833);
  });

  it('Safe calculation wrapper returns errors gracefully without throwing', () => {
    const safeZero = safeCalculateFuelTrip({ distanceKm: 0 });
    expect(safeZero.result).toBeNull();
    expect(safeZero.error).toBeDefined();

    const safeValid = safeCalculateFuelTrip({
      distanceKm: 100,
      fuelConsumptionKmPerL: 10,
      fuelPricePerLiter: 10000,
      isRoundTrip: false,
      passengerCount: 2,
    });
    expect(safeValid.result).not.toBeNull();
    expect(safeValid.result?.costPerPassengerIdr).toBe(50000);
  });
});

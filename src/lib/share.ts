import { FuelTripInput, FuelTripOutput } from '../types/fuel';
import { formatNumber, formatRupiah } from './formatters';

export function generateTripSummaryText(
  input: FuelTripInput,
  output: FuelTripOutput
): string {
  const tripType = input.isRoundTrip ? 'Pulang - Pergi (PP)' : 'Sekali Jalan (One-Way)';
  const vehicleText = input.vehicleName ? `🚗 Kendaraan: ${input.vehicleName}` : `🚗 Efisiensi: ${input.fuelConsumptionKmPerL} km/L`;
  const fuelText = input.fuelName ? `⛽ BBM: ${input.fuelName} (${formatRupiah(input.fuelPricePerLiter)}/L)` : `⛽ Harga BBM: ${formatRupiah(input.fuelPricePerLiter)}/L`;
  const title = input.tripName ? `📍 ${input.tripName}` : '📍 Rencana Perjalanan';

  let summary = `*ESTIMASI BIAYA PERJALANAN - FUELTRIP ID*\n`;
  summary += `─────────────────────────\n`;
  summary += `${title}\n`;
  summary += `🛣️ Tipe Rute: ${tripType}\n`;
  summary += `📏 Jarak Total: ${formatNumber(output.effectiveDistanceKm)} km\n`;
  summary += `${vehicleText}\n`;
  summary += `${fuelText}\n`;
  summary += `─────────────────────────\n`;
  summary += `*📊 RINGKASAN BIAYA*\n`;
  summary += `• Kebutuhan BBM: *${formatNumber(output.totalLiters, true)} Liter*\n`;
  summary += `• Estimasi Total Biaya: *${formatRupiah(output.totalCostIdr)}*\n`;
  summary += `• Biaya / KM: ${formatRupiah(output.costPerKmIdr)}/km\n`;

  if (input.passengerCount > 1) {
    summary += `\n*👥 PEMBAGIAN BIAYA (${input.passengerCount} Orang)*\n`;
    summary += `• Biaya per Orang: *${formatRupiah(output.costPerPassengerIdr)}*\n`;
  }

  summary += `─────────────────────────\n`;
  summary += `_Dihitung dengan FuelTrip ID - Kalkulator BBM & Mudik_`;

  return summary;
}

export function generateWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for non-https or older browser support
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

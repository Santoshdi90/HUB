import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Plant, PlantVariety } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppLink(
  whatsappNum: string,
  variety?: PlantVariety,
  parentPlantName?: string
): string {
  const cleanPhone = whatsappNum.replace(/[^0-9]/g, '');

  let text = '';
  if (variety && parentPlantName) {
    text = `Namaskara, I want to book/order ${variety.varietyName} of ${parentPlantName} from Rani Channamma Hitech Nursery.\n\n` +
      `🌱 Variety: ${variety.varietyName}\n` +
      `🌾 Crop: ${parentPlantName}\n` +
      `💰 Rate: ${formatCurrency(variety.price)} ${variety.unit || '/ sapling'}\n` +
      `📦 Stock Status: ${variety.stockStatus}\n` +
      `⏱️ Days to Maturity: ${variety.daysToMaturity}\n\n` +
      `Please share availability and farm delivery details to my location.`;
  } else {
    text = `Namaskara, I would like to inquire about plant sapling availability and bulk supply from Rani Channamma Hitech Nursery.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

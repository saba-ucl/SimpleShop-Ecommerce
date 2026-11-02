// ------------------------------------------------------------
// Currency settings for SimpleShop
//
// All prices are stored in the database in Danish kroner (DKK).
// To show prices in another currency, change DISPLAY_CURRENCY below
// to 'EUR' or 'INR' and restart the frontend. Nothing else needs to change.
// ------------------------------------------------------------

export const DISPLAY_CURRENCY = 'DKK'; // 'DKK' | 'EUR' | 'INR'

// The currency prices are stored in (used in the admin product form).
export const BASE_CURRENCY = 'DKK';

// Fixed demo exchange rates: how much 1 DKK is worth in each currency.
// These are approximate and never updated automatically - fine for a demo shop.
const CURRENCIES = {
  DKK: { rate: 1, locale: 'da-DK' },      // 1.234,50 kr.
  EUR: { rate: 1 / 7.46, locale: 'da-DK' }, // 165,49 €
  INR: { rate: 13, locale: 'en-IN' }       // ₹16,049.00
};

const settings = CURRENCIES[DISPLAY_CURRENCY] || CURRENCIES.DKK;

const formatter = new Intl.NumberFormat(settings.locale, {
  style: 'currency',
  currency: CURRENCIES[DISPLAY_CURRENCY] ? DISPLAY_CURRENCY : 'DKK'
});

// Turns a DKK amount from the backend into a formatted price string.
export function formatPrice(amountInDkk) {
  return formatter.format(Number(amountInDkk) * settings.rate);
}

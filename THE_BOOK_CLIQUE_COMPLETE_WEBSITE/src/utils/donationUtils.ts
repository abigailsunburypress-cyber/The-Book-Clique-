// Country-specific official currencies and formatters for verified donations
export interface CountryCurrencyRule {
  country: string;
  currency: string;
  currencyName: string;
  flag: string;
}

export const OFFICIAL_COUNTRY_CURRENCIES: CountryCurrencyRule[] = [
  { country: 'Kuwait', currency: 'KWD', currencyName: 'Kuwaiti dinar', flag: '🇰🇼' },
  { country: 'Bahrain', currency: 'BHD', currencyName: 'Bahraini dinar', flag: '🇧🇭' },
  { country: 'Oman', currency: 'OMR', currencyName: 'Omani rial', flag: '🇴🇲' },
  { country: 'Jordan', currency: 'JOD', currencyName: 'Jordanian dinar', flag: '🇯🇴' },
  { country: 'United Kingdom', currency: 'GBP', currencyName: 'British pound', flag: '🇬🇧' },
  { country: 'Switzerland', currency: 'CHF', currencyName: 'Swiss franc', flag: '🇨🇭' },
  { country: 'Germany', currency: 'EUR', currencyName: 'Euro', flag: '🇩🇪' },
  { country: 'France', currency: 'EUR', currencyName: 'Euro', flag: '🇫🇷' },
  { country: 'Netherlands', currency: 'EUR', currencyName: 'Euro', flag: '🇳🇱' },
  { country: 'Ireland', currency: 'EUR', currencyName: 'Euro', flag: '🇮🇪' },
  { country: 'United States', currency: 'USD', currencyName: 'US dollar', flag: '🇺🇸' }
];

export const INTENDED_COUNTRY_ROTATION_ORDER: string[] = [
  'Kuwait',
  'Bahrain',
  'Oman',
  'Jordan',
  'United Kingdom',
  'Switzerland',
  'Germany',
  'France',
  'Netherlands',
  'Ireland',
  'United States'
];

/**
 * Format donation amount using the actual verified transaction currency
 * - Kuwaiti dinar (KWD), Bahraini dinar (BHD), Omani rial (OMR) standardly use 3 decimal places
 * - British pound (GBP), Euro (EUR), US dollar (USD), Swiss franc (CHF), Jordanian dinar (JOD) use 2 decimal places
 */
export function formatDonationAmount(amount: number, currency: string): string {
  const curr = (currency || 'USD').toUpperCase();
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;

  switch (curr) {
    case 'KWD':
      return `${num.toFixed(3)} KWD`;
    case 'BHD':
      return `${num.toFixed(3)} BHD`;
    case 'OMR':
      return `${num.toFixed(3)} OMR`;
    case 'JOD':
      return `${num.toFixed(2)} JOD`;
    case 'GBP':
      return `£${num.toFixed(2)} GBP`;
    case 'EUR':
      return `€${num.toFixed(2)} EUR`;
    case 'USD':
      return `$${num.toFixed(2)} USD`;
    case 'CHF':
      return `${num.toFixed(2)} CHF`;
    default:
      return `${num.toFixed(2)} ${curr}`;
  }
}

/**
 * Get country flag emoji or symbol
 */
export function getCountryFlag(countryName: string): string {
  const match = OFFICIAL_COUNTRY_CURRENCIES.find(
    (c) => c.country.toLowerCase() === (countryName || '').toLowerCase()
  );
  return match?.flag || '🌐';
}

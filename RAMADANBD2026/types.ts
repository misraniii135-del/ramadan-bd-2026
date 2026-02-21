
export interface PrayerTimeData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  readableDate: string;
}

export interface Banner {
  image: string;
  link: string;
  isYoutube: boolean;
}

export enum AppTab {
  HOME = 'home',
  PRAYER = 'prayer',
  DONATION = 'donation',
  ASSISTANT = 'assistant',
  DONATION_DETAILS = 'donation_details'
}

export enum AppTheme {
  EMERALD = 'emerald',
  GOLDEN = 'golden',
  INDIGO = 'indigo'
}

export interface IslamicQuote {
  text: string;
  reference: string;
}

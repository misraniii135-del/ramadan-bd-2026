
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

export interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
}

export enum AppTab {
  HOME = 'home',
  PRAYER = 'prayer',
  DONATION = 'donation',
  ASSISTANT = 'assistant',
  DONATION_DETAILS = 'donation_details'
}

export interface IslamicQuote {
  text: string;
  reference: string;
}

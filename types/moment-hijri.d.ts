// types/moment-hijri.d.ts
import 'moment';

declare module 'moment' {
  interface Moment {
    // Hijri getters/setters
    iYear(): number;
    iYear(year: number): Moment;

    iMonth(): number;
    iMonth(month: number): Moment;

    iDate(): number;
    iDate(date: number): Moment;

    // Menjamin .add('iMonth' | 'iYear') tidak dikeluhkan TS
    add(amount: number, unit: 'iYear' | 'iMonth' | string): Moment;
  }
}

// Ekspor modul moment-hijri sebagai instance moment yang sama
declare module 'moment-hijri' {
  import moment = require('moment');
  export = moment;
}

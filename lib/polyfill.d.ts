import * as moment from 'moment';
declare global {
  interface String {
    isCnNewID(): boolean;
  }
  interface Date {
    getStamp(): number;
  }
  interface DateConstructor {
    getCurrentStamp(): number;
    moment(
      inp?: moment.MomentInput,
      format?: moment.MomentFormatSpecification,
      strict?: boolean
    ): moment.Moment;
    moment(
      inp?: moment.MomentInput,
      format?: moment.MomentFormatSpecification,
      language?: string,
      strict?: boolean
    ): moment.Moment;
  }
}

declare module 'phusis/polyfill';

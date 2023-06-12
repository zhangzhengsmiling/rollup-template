import moment from 'moment';
import { DateType } from './types';
export const isDateEqual = (date1: string, date2: string) => {
  return moment(date1).valueOf() === moment(date2).valueOf();
};

const padStart = (len: number, padding: string) => {
  return (str: string) => str.padStart(len, padding);
};

const toString = (num: number) => num.toString();

export const dateToString = ({ year, month, day }: DateType) =>
  [year, month, day].map(toString).map(padStart(2, '0')).join('-');

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
dayjs.extend(isToday);
dayjs.extend(utc);
export function formatFontWeight(value: number) {
  if (value === 700) {
    return 'Inter-Bold';
  } else if (value === 600) {
    return 'Inter-SemiBold';
  } else if (value === 500) {
    return 'Inter-Medium';
  } else if (value === 400) {
    return 'Inter-Regular';
  } else if (value === 300) {
    return 'Inter-Light';
  } else if (value === 200) {
    return 'Inter-ExtraLight';
  } else if (value === 100) {
    return 'Inter-Thin';
  }
}

export const formatFilename = (filename?: string) => {
  const date = dayjs().format('YYYYMMDD-HHmmss');
  const randomString = Math.random().toString(36).substring(2, 7);
  const cleanFileName = (filename || '')
    .substring((filename || '').length - 30)
    .toLowerCase();
  const newFilename = `${date}-${randomString}-${cleanFileName}`;
  return newFilename;
};

/**
 * Converts a number to a formatted currency string.
 *
 * @param value The value to convert.
 * @param currency The currency code.
 * @param maximumFractionDigits The maximum number of fraction digits to display. Default is 8.
 * @returns The formatted currency string.
 */
export function toCurrency(
  value: number | undefined,
  currency: string,
  maximumFractionDigits: number = 8,
): string {
  if (typeof value === 'undefined') {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits,
  })
    .format(value)
    .replace('SGD', 'S$');
}

export function formatDecimalPlaces(value: string, numberOfDecimal: number) {
  if (!value) {
    return '';
  }
  if (value.endsWith('.')) {
    return value;
  }
  const regex = new RegExp(`^(\\d+.?\\d{0,${numberOfDecimal}})\\d*$`);
  return value.toString().replace(regex, '$1');
}

export function toChatDateTime(
  dateTime?: Date | string | number,
  returnTodayText = false,
): string {
  if (!dateTime) {
    return '';
  }
  const isInLast7days = dayjs().subtract(7, 'days').isBefore(dayjs(dateTime));
  if (dayjs(dateTime).isToday()) {
    return returnTodayText ? 'Today' : dayjs(dateTime).format('HH:mm');
  } else if (isInLast7days) {
    return dayjs(dateTime).format('dddd');
  } else {
    return dayjs(dateTime).format('DD/MM/YYYY');
  }
}

export const fileSize = (size: number) => {
  return Math.round((size / 1024 / 1024) * 100) / 100;
};

export function formatBytes(value: string | number): string {
  if (!value) {
    return '';
  }
  const bytes = parseFloat(value.toString());
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  } else if (bytes < 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  } else {
    return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`;
  }
}

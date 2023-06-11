import dayjs from 'dayjs';

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

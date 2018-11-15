const padNumber = (num: number): string =>
  num < 10 ? `0${num.toString()}` : num.toString();

export const generateTimestamp = (date: Date): string => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());
  const seconds = padNumber(date.getSeconds());

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const generateLNMPassword = (
  shortcode: number,
  passkey: string,
  timestamp: string
): string =>
  Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

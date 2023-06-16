export function validateEmail(email: string): boolean {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase()) && !isBlankString(email);
}

export function isBlankString(stringValue: string | null | undefined): boolean {
  return !stringValue || stringValue.toString().trim().length === 0;
}

export function validatePostalCode(code: string): boolean {
  if (isBlankString(code) || code.length > 6 || code.length < 6) return false;
  const re = /^\d+$/;
  return re.test(String(code).toLowerCase());
}

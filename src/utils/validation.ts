export function isValidId(id: string | number | undefined | null): boolean {
  if (id === undefined || id === null) return false;
  return String(id).trim().length > 0;
}

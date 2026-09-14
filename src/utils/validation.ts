export function isValidId(id: string | undefined | null): id is string {
  return Boolean(id?.trim());
}
export function formatDate(iso: string) {
  return iso.slice(0, 10).replaceAll("-", ".");
}

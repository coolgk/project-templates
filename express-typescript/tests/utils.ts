export function getRandomString(prefix = 'random'): string {
  return `${prefix}_${Math.random()}_string`;
}

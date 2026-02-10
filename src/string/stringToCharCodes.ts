export function stringToCharCodes(input: string): number[] {
  return Array.from(input).map((char) => char.charCodeAt(0));
}

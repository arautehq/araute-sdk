const snakeToCamel = (key: string) =>
  key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

const camelToSnake = (key: string) =>
  key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

function mapKeys(value: unknown, mapKey: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((item) => mapKeys(item, mapKey));
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      mapKey(key),
      mapKeys(item, mapKey),
    ]),
  );
}

export function toCamelCase<T>(value: unknown): T {
  return mapKeys(value, snakeToCamel) as T;
}

export function toSnakeCase<T>(value: unknown): T {
  return mapKeys(value, camelToSnake) as T;
}

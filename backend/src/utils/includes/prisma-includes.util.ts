export function buildPrismaInclude(
  includes: string[],
  availableIncludes: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(availableIncludes)) {
    if (!includes.includes(key)) continue;

    if (typeof value === 'string') {
      // Include simples, como { company: true }
      result[value] = true;
    } else if (typeof value === 'object') {
      // Include aninhado, como { items: { include: { part: true } } }
      result[key] = value;
    }
  }

  return result;
}

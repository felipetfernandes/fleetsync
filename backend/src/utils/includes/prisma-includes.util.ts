export function buildPrismaInclude(
  includes: string[],
  availableIncludes: Record<string, string>
) {
  const include: Record<string, boolean> = {};

  for (const [key, prismaKey] of Object.entries(availableIncludes)) {
    include[prismaKey] = includes.includes(key);
  }

  return include;
}

export function buildPrismaInclude(
  includes: string[],
  availableIncludes: Record<string, string> = {
    vehicle: 'vehicles',
    workshops: 'workshops',
    users: 'users',
    company: 'company',
    orders: 'Order',
  },
) {
  const include: Record<string, boolean> = {};

  for (const [key, prismaKey] of Object.entries(availableIncludes)) {
    include[prismaKey] = includes.includes(key);
  }

  return include;
}

export const vehicleAvailableIncludes = {
  company: "company",
  branch: "branch",
  driver: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      licenseNumber: true,
      licenseCategory: true,
      licenseExpiration: true,
    },
  },
  orders: "order",
  mileageHistory: "MileageHistory",
};

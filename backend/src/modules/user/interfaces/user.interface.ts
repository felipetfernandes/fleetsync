export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  WORKSHOP_MANAGER = 'WORKSHOP_MANAGER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseExpiration?: Date;
  branchId: number;
  createdAt: Date;
  updatedAt: Date;
}
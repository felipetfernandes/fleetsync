export interface Workshop {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  branchId: number;
  managerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
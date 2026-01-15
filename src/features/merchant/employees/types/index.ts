export interface Employee {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  isActive: boolean;
  joinedDate: string;
  lastActive?: string;
  permissions: {
    canManageEmployees: boolean;
    canManageOrders: boolean;
    canViewAnalytics: boolean;
    canManagePromotions: boolean;
  };
}

export interface EmployeeFormData {
  name: string;
  email: string;
  role: 'manager' | 'staff';
  permissions: {
    canManageEmployees: boolean;
    canManageOrders: boolean;
    canViewAnalytics: boolean;
    canManagePromotions: boolean;
  };
}

export interface EmployeeModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  employee?: Employee;
}
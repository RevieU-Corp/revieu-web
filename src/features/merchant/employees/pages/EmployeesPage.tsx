import React, { useState } from 'react';
import { Users, Plus, Edit, Power, PowerOff, Shield, Clock, Mail } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import ConfirmationDialog from '../../shared/components/ConfirmationDialog';
import EmployeeModal from '../components/EmployeeModal';
import { Employee, EmployeeModalState } from '../types';

const EmployeesPage: React.FC = () => {
  // Mock data for employees
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@mcdonalds.com",
      role: 'owner',
      isActive: true,
      joinedDate: "2023-01-15",
      lastActive: "2024-01-15T10:30:00Z",
      permissions: {
        canManageEmployees: true,
        canManageOrders: true,
        canViewAnalytics: true,
        canManagePromotions: true,
      }
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@mcdonalds.com",
      role: 'manager',
      isActive: true,
      joinedDate: "2023-03-20",
      lastActive: "2024-01-15T09:15:00Z",
      permissions: {
        canManageEmployees: false,
        canManageOrders: true,
        canViewAnalytics: true,
        canManagePromotions: true,
      }
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@mcdonalds.com",
      role: 'staff',
      isActive: true,
      joinedDate: "2023-06-10",
      lastActive: "2024-01-14T16:45:00Z",
      permissions: {
        canManageEmployees: false,
        canManageOrders: true,
        canViewAnalytics: false,
        canManagePromotions: false,
      }
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@mcdonalds.com",
      role: 'staff',
      isActive: false,
      joinedDate: "2023-08-05",
      lastActive: "2024-01-10T14:20:00Z",
      permissions: {
        canManageEmployees: false,
        canManageOrders: true,
        canViewAnalytics: false,
        canManagePromotions: false,
      }
    }
  ]);

  const [employeeModal, setEmployeeModal] = useState<EmployeeModalState>({
    isOpen: false,
    mode: 'add'
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleAddEmployee = () => {
    setEmployeeModal({
      isOpen: true,
      mode: 'add'
    });
  };

  const handleEditEmployee = (employee: Employee) => {
    if (employee.role === 'owner') {
      return; // Owners cannot be edited
    }
    setEmployeeModal({
      isOpen: true,
      mode: 'edit',
      employee
    });
  };

  const handleToggleEmployeeStatus = (employee: Employee) => {
    if (employee.role === 'owner') {
      return; // Owners cannot be disabled
    }

    const action = employee.isActive ? 'disable' : 'enable';
    setConfirmDialog({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Employee`,
      message: `Are you sure you want to ${action} ${employee.name}? ${
        action === 'disable' 
          ? 'They will lose access to the merchant portal.' 
          : 'They will regain access to the merchant portal.'
      }`,
      onConfirm: () => {
        setEmployees(prev => 
          prev.map(emp => 
            emp.id === employee.id 
              ? { ...emp, isActive: !emp.isActive }
              : emp
          )
        );
      }
    });
  };

  const handleSaveEmployee = (employeeData: any) => {
    if (employeeModal.mode === 'add') {
      // Check for duplicate email
      const emailExists = employees.some(emp => emp.email === employeeData.email);
      if (emailExists) {
        alert('An employee with this email already exists.');
        return;
      }

      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...employeeData,
        isActive: true,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString()
      };
      setEmployees(prev => [...prev, newEmployee]);
    } else if (employeeModal.mode === 'edit' && employeeModal.employee) {
      // Check for duplicate email (excluding current employee)
      const emailExists = employees.some(emp => 
        emp.email === employeeData.email && emp.id !== employeeModal.employee!.id
      );
      if (emailExists) {
        alert('An employee with this email already exists.');
        return;
      }

      setEmployees(prev => 
        prev.map(emp => 
          emp.id === employeeModal.employee!.id 
            ? { ...emp, ...employeeData }
            : emp
        )
      );
    }

    setEmployeeModal({ isOpen: false, mode: 'add' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeEmployees = employees.filter(emp => emp.isActive);
  const inactiveEmployees = employees.filter(emp => !emp.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and their permissions
          </p>
        </div>
        <Button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={20} />
          Add Employee
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Power size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <PowerOff size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-gray-900">{inactiveEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Employees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power size={20} className="text-green-600" />
            Active Employees ({activeEmployees.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {activeEmployees.map((employee) => (
              <div key={employee.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock size={14} />
                        Last active: {formatLastActive(employee.lastActive)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(employee.role)}`}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      {employee.role !== 'owner' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                            className="text-gray-600 hover:text-blue-600"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleEmployeeStatus(employee)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <PowerOff size={16} />
                          </Button>
                        </>
                      )}
                      {employee.role === 'owner' && (
                        <div className="flex items-center gap-1 text-purple-600">
                          <Shield size={16} />
                          <span className="text-xs">Owner</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Permissions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {employee.permissions.canManageEmployees && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      Manage Employees
                    </span>
                  )}
                  {employee.permissions.canManageOrders && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Manage Orders
                    </span>
                  )}
                  {employee.permissions.canViewAnalytics && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      View Analytics
                    </span>
                  )}
                  {employee.permissions.canManagePromotions && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      Manage Promotions
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inactive Employees */}
      {inactiveEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PowerOff size={20} className="text-red-600" />
              Inactive Employees ({inactiveEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {inactiveEmployees.map((employee) => (
                <div key={employee.id} className="p-4 hover:bg-gray-50 transition-colors opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-semibold">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">{employee.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail size={14} />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock size={14} />
                          Last active: {formatLastActive(employee.lastActive)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleEmployeeStatus(employee)}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <Power size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={employeeModal.isOpen}
        mode={employeeModal.mode}
        employee={employeeModal.employee}
        onClose={() => setEmployeeModal({ isOpen: false, mode: 'add' })}
        onSave={handleSaveEmployee}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="warning"
        confirmText="Confirm"
      />
    </div>
  );
};

export default EmployeesPage;
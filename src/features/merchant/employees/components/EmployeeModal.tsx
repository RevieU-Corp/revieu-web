import React, { useState, useEffect } from 'react';
import { X, User, Shield, Settings } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Employee, EmployeeFormData } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  employee?: Employee;
  onClose: () => void;
  onSave: (employeeData: EmployeeFormData) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  mode,
  employee,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    email: '',
    role: 'staff',
    permissions: {
      canManageEmployees: false,
      canManageOrders: true,
      canViewAnalytics: false,
      canManagePromotions: false,
    }
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && employee) {
        setFormData({
          name: employee.name,
          email: employee.email,
          role: employee.role as 'manager' | 'staff',
          permissions: employee.permissions
        });
      } else {
        setFormData({
          name: '',
          email: '',
          role: 'staff',
          permissions: {
            canManageEmployees: false,
            canManageOrders: true,
            canViewAnalytics: false,
            canManagePromotions: false,
          }
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, employee]);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleRoleChange = (role: 'manager' | 'staff') => {
    let newPermissions = { ...formData.permissions };
    
    if (role === 'manager') {
      // Managers get more permissions by default
      newPermissions = {
        canManageEmployees: false, // Still requires explicit permission
        canManageOrders: true,
        canViewAnalytics: true,
        canManagePromotions: true,
      };
    } else {
      // Staff get basic permissions
      newPermissions = {
        canManageEmployees: false,
        canManageOrders: true,
        canViewAnalytics: false,
        canManagePromotions: false,
      };
    }

    setFormData(prev => ({
      ...prev,
      role,
      permissions: newPermissions
    }));
  };

  const handlePermissionChange = (permission: keyof EmployeeFormData['permissions']) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <User size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'add' ? 'Add New Employee' : 'Edit Employee'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <User size={16} />
              Basic Information
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter employee's full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter employee's email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Shield size={16} />
              Role
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('manager')}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  formData.role === 'manager'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">Manager</div>
                <div className="text-sm text-gray-600">Can manage operations</div>
              </button>
              
              <button
                type="button"
                onClick={() => handleRoleChange('staff')}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  formData.role === 'staff'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">Staff</div>
                <div className="text-sm text-gray-600">Basic access</div>
              </button>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Settings size={16} />
              Permissions
            </h4>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canManageEmployees}
                  onChange={() => handlePermissionChange('canManageEmployees')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Manage Employees</div>
                  <div className="text-sm text-gray-600">Add, edit, and manage team members</div>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canManageOrders}
                  onChange={() => handlePermissionChange('canManageOrders')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Manage Orders</div>
                  <div className="text-sm text-gray-600">Process and manage customer orders</div>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canViewAnalytics}
                  onChange={() => handlePermissionChange('canViewAnalytics')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Access business analytics and reports</div>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.permissions.canManagePromotions}
                  onChange={() => handlePermissionChange('canManagePromotions')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-900">Manage Promotions</div>
                  <div className="text-sm text-gray-600">Create and manage coupons and deals</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {mode === 'add' ? 'Add Employee' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
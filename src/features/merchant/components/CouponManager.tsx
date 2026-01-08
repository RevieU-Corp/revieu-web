import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, Gift, Save } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

interface Coupon {
  id: number;
  name: string;
  type: string;
  quantity: number;
  used: number;
  isActive: boolean;
  expiryDate: string;
  description?: string;
}

interface CouponManagerProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: Coupon[];
  onUpdateCoupons: (coupons: Coupon[]) => void;
}

const CouponManager: React.FC<CouponManagerProps> = ({ isOpen, onClose, coupons, onUpdateCoupons }) => {
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(coupons);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: 0,
    expiryDate: '',
    description: ''
  });

  // Sync local state with props when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalCoupons(coupons);
    }
  }, [isOpen, coupons]);

  if (!isOpen) return null;

  const updateLocalCoupons = (newCoupons: Coupon[]) => {
    setLocalCoupons(newCoupons);
    // Immediately update parent state for real-time sync
    onUpdateCoupons(newCoupons);
  };

  const handleSave = () => {
    onUpdateCoupons(localCoupons);
    onClose();
  };

  const handleCreateCoupon = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      type: '',
      quantity: 0,
      expiryDate: '',
      description: ''
    });
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      name: coupon.name,
      type: coupon.type,
      quantity: coupon.quantity,
      expiryDate: coupon.expiryDate,
      description: coupon.description || ''
    });
  };

  const handleSubmitCoupon = () => {
    if (isCreating) {
      const newCoupon: Coupon = {
        id: Math.max(...localCoupons.map(c => c.id), 0) + 1,
        name: formData.name,
        type: formData.type,
        quantity: formData.quantity,
        used: 0,
        isActive: true,
        expiryDate: formData.expiryDate,
        description: formData.description
      };
      updateLocalCoupons([...localCoupons, newCoupon]);
    } else if (editingCoupon) {
      updateLocalCoupons(localCoupons.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...formData }
          : c
      ));
    }
    
    setIsCreating(false);
    setEditingCoupon(null);
    setFormData({ name: '', type: '', quantity: 0, expiryDate: '', description: '' });
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Coupon',
      message: `Are you sure you want to delete "${coupon.name}"? This action cannot be undone.`,
      onConfirm: () => {
        updateLocalCoupons(localCoupons.filter(c => c.id !== coupon.id));
      }
    });
  };

  const toggleCouponStatus = (couponId: number) => {
    updateLocalCoupons(localCoupons.map(c => 
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const isFormValid = formData.name.trim() && formData.type.trim() && formData.quantity > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Gift className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Coupon Management</h3>
                <p className="text-sm text-gray-600">Create, edit, and manage your promotional coupons</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Create/Edit Form */}
            {(isCreating || editingCoupon) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">
                  {isCreating ? 'Create New Coupon' : 'Edit Coupon'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., Student Special"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="e.g., 20% Off, $5 Off, Buy 1 Get 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="100"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Describe the coupon details, terms, or special conditions..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleSubmitCoupon}
                    disabled={!isFormValid}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: isFormValid ? '#FFBC0D' : undefined }}
                  >
                    <Save size={16} />
                    {isCreating ? 'Create Coupon' : 'Update Coupon'}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCoupon(null);
                      setFormData({ name: '', type: '', quantity: 0, expiryDate: '', description: '' });
                    }}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Button */}
            {!isCreating && !editingCoupon && (
              <div className="mb-6">
                <button
                  onClick={handleCreateCoupon}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  style={{ backgroundColor: '#FFBC0D' }}
                >
                  <Plus size={16} />
                  Create New Coupon
                </button>
              </div>
            )}

            {/* Coupons List */}
            <div className="space-y-4">
              {localCoupons.map((coupon) => (
                <div key={coupon.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{coupon.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {coupon.type}
                        </span>
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Used: {coupon.used}/{coupon.quantity}</span>
                        <span>Expires: {coupon.expiryDate || 'No expiry'}</span>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${(coupon.used / coupon.quantity) * 100}%`,
                            backgroundColor: '#FFBC0D'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit coupon"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {localCoupons.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gift size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No coupons yet. Create your first promotional coupon!</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              style={{ backgroundColor: '#FFBC0D' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type="danger"
      />
    </>
  );
};

export default CouponManager;
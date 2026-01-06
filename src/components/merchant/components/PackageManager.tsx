import React, { useState } from 'react';
import { X, Plus, Edit3, Trash2, Package, Save, Upload, CheckCircle } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

interface BundleItem {
  id: number;
  name: string;
  price: number;
}

interface Package {
  id: number;
  name: string;
  description: string;
  bundleItems: BundleItem[];
  originalPrice: number;
  bundlePrice: number;
  isActive: boolean;
  productImage?: string;
}

interface PackageManagerProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
  onUpdatePackages: (packages: Package[]) => void;
}

const PackageManager: React.FC<PackageManagerProps> = ({ isOpen, onClose, packages, onUpdatePackages }) => {
  const [localPackages, setLocalPackages] = useState<Package[]>(packages);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
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
    description: '',
    bundleItems: [] as BundleItem[],
    originalPrice: '' as string | number,
    bundlePrice: '' as string | number,
    productImage: ''
  });

  const [newItem, setNewItem] = useState({ name: '', price: '' as string | number });

  // Sync local state with props when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalPackages(packages);
    }
  }, [isOpen, packages]);

  if (!isOpen) return null;

  const updateLocalPackages = (newPackages: Package[]) => {
    setLocalPackages(newPackages);
    onUpdatePackages(newPackages);
  };

  const handleCreatePackage = () => {
    setIsCreating(true);
    setFormData({
      name: '',
      description: '',
      bundleItems: [],
      originalPrice: '',
      bundlePrice: '',
      productImage: ''
    });
    setNewItem({ name: '', price: '' });
  };

  const handleEditPackage = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      bundleItems: [...pkg.bundleItems],
      originalPrice: pkg.originalPrice,
      bundlePrice: pkg.bundlePrice,
      productImage: pkg.productImage || ''
    });
    setNewItem({ name: '', price: '' });
  };

  const handleAddItem = () => {
    const price = typeof newItem.price === 'string' ? parseFloat(newItem.price) : newItem.price;
    if (newItem.name.trim() && price > 0) {
      const item: BundleItem = {
        id: Math.max(...formData.bundleItems.map(i => i.id), 0) + 1,
        name: newItem.name.trim(),
        price: price
      };
      setFormData(prev => ({
        ...prev,
        bundleItems: [...prev.bundleItems, item]
      }));
      setNewItem({ name: '', price: '' });
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData(prev => ({
      ...prev,
      bundleItems: prev.bundleItems.filter(item => item.id !== itemId)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPEG, PNG, or WebP image');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, productImage: imageUrl }));
    }
  };

  const calculateSavings = () => {
    const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) || 0 : formData.originalPrice;
    const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) || 0 : formData.bundlePrice;
    return original - bundle;
  };

  const calculateSavingsPercentage = () => {
    const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) || 0 : formData.originalPrice;
    const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) || 0 : formData.bundlePrice;
    if (original === 0) return 0;
    return Math.round(((original - bundle) / original) * 100);
  };

  const handleSubmitPackage = () => {
    const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) : formData.originalPrice;
    const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) : formData.bundlePrice;
    
    if (isCreating) {
      const newPackage: Package = {
        id: Math.max(...localPackages.map(p => p.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        bundleItems: formData.bundleItems,
        originalPrice: original,
        bundlePrice: bundle,
        isActive: true,
        productImage: formData.productImage
      };
      updateLocalPackages([...localPackages, newPackage]);
    } else if (editingPackage) {
      updateLocalPackages(localPackages.map(p => 
        p.id === editingPackage.id 
          ? { ...p, ...formData, originalPrice: original, bundlePrice: bundle }
          : p
      ));
    }
    
    setIsCreating(false);
    setEditingPackage(null);
    setFormData({ name: '', description: '', bundleItems: [], originalPrice: '', bundlePrice: '', productImage: '' });
  };

  const handleDeletePackage = (pkg: Package) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Package',
      message: `Are you sure you want to delete "${pkg.name}"? This action cannot be undone.`,
      onConfirm: () => {
        updateLocalPackages(localPackages.filter(p => p.id !== pkg.id));
      }
    });
  };

  const togglePackageStatus = (packageId: number) => {
    updateLocalPackages(localPackages.map(p => 
      p.id === packageId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const isFormValid = () => {
    const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) || 0 : formData.originalPrice;
    const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) || 0 : formData.bundlePrice;
    return formData.name.trim() && formData.description.trim() && 
           formData.bundleItems.length > 0 && original > 0 && 
           bundle > 0 && bundle < original;
  };

  const isPricingValid = () => {
    const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) || 0 : formData.originalPrice;
    const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) || 0 : formData.bundlePrice;
    return original > 0 && bundle > 0 && bundle < original;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Package Management</h3>
                <p className="text-sm text-gray-600">Create and manage bundled offerings for better value</p>
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
            {(isCreating || editingPackage) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">
                  {isCreating ? 'Create New Package' : 'Edit Package'}
                </h4>
                
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Pricing Guide:</strong> Set both the original price (what customers would pay for items separately) and your bundle price (discounted package price). The savings will be calculated automatically.
                  </p>
                </div>
                
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Student Combo Meal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-image"
                        />
                        <label
                          htmlFor="product-image"
                          className="flex items-center justify-center w-full h-10 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          {formData.productImage ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-sm text-green-700">Image uploaded</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-600">Upload image</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe what's included in this package..."
                      rows={3}
                    />
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Original Price (MSRP)
                        <span className="text-xs text-gray-500 block">Total if bought separately</span>
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bundle Price
                        <span className="text-xs text-gray-500 block">Your discounted package price</span>
                      </label>
                      <input
                        type="number"
                        value={formData.bundlePrice}
                        onChange={(e) => setFormData({ ...formData, bundlePrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Savings
                        <span className="text-xs text-gray-500 block">Calculated automatically</span>
                      </label>
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-green-700">
                          ${calculateSavings().toFixed(2)} ({calculateSavingsPercentage()}% off)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Validation Feedback */}
                  {(formData.originalPrice !== '' || formData.bundlePrice !== '') && !isPricingValid() && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        {(() => {
                          const original = typeof formData.originalPrice === 'string' ? parseFloat(formData.originalPrice) || 0 : formData.originalPrice;
                          const bundle = typeof formData.bundlePrice === 'string' ? parseFloat(formData.bundlePrice) || 0 : formData.bundlePrice;
                          if (bundle >= original && original > 0 && bundle > 0) {
                            return "Bundle price must be less than the original price to show savings.";
                          } else {
                            return "Please enter both original price and bundle price.";
                          }
                        })()}
                      </p>
                    </div>
                  )}

                  {/* Bundle Items */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bundle Items</label>
                    
                    {/* Add Item Form */}
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={handleAddItem}
                        disabled={!newItem.name.trim() || !newItem.price || (typeof newItem.price === 'string' ? parseFloat(newItem.price) <= 0 : newItem.price <= 0)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {formData.bundleItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="ml-2 text-sm text-gray-600">${item.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {formData.bundleItems.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No items added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleSubmitPackage}
                    disabled={!isFormValid()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save size={16} />
                    {isCreating ? 'Create Package' : 'Update Package'}
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingPackage(null);
                      setFormData({ name: '', description: '', bundleItems: [], originalPrice: '', bundlePrice: '', productImage: '' });
                    }}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Add New Button */}
            {!isCreating && !editingPackage && (
              <div className="mb-6">
                <button
                  onClick={handleCreatePackage}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus size={16} />
                  Create New Package
                </button>
              </div>
            )}

            {/* Packages List */}
            <div className="space-y-4">
              {localPackages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{pkg.name}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ${pkg.bundlePrice.toFixed(2)}
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium line-through">
                          ${pkg.originalPrice.toFixed(2)}
                        </span>
                        <button
                          onClick={() => togglePackageStatus(pkg.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pkg.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {pkg.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{pkg.bundleItems.length} items</span>
                        <span className="font-medium text-green-600">
                          Save ${(pkg.originalPrice - pkg.bundlePrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit package"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        title="Delete package"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {localPackages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Package size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>No packages yet. Create your first bundled offering!</p>
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
              onClick={() => {
                onUpdatePackages(localPackages);
                onClose();
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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

export default PackageManager;
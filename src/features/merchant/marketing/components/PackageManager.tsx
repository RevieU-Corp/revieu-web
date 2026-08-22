import React from 'react';
import { CheckCircle, Package, X } from 'lucide-react';

interface BundleItem {
  id: number;
  name: string;
  price: number;
}

export interface MerchantPackage {
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
  packages: MerchantPackage[];
}

/**
 * Package writes are intentionally not exposed until the backend has
 * merchant-scoped create/update/status/delete endpoints. Keeping this modal
 * read-only prevents browser-local state from masquerading as persistence.
 */
const PackageManager: React.FC<PackageManagerProps> = ({ isOpen, onClose, packages }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-manager-title"
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 id="package-manager-title" className="text-lg font-semibold text-gray-900">Package Management</h2>
            <p className="text-sm text-gray-500 mt-1">Server-backed package management is not available yet.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close package management"
            className="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div role="status" className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
            <CheckCircle className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="text-sm">
              <p className="font-semibold">Coming soon</p>
              <p className="mt-1">
                Merchant package create, edit, enable/disable, and delete APIs are not implemented yet.
                No local-only changes can be saved from this screen.
              </p>
            </div>
          </div>

          {packages.length > 0 ? (
            <div className="space-y-3" aria-label="Available packages">
              {packages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
                    </div>
                    <span className="text-xs rounded-full px-2 py-1 bg-gray-100 text-gray-600">
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-3">
                    ${pkg.bundlePrice.toFixed(2)} · {pkg.bundleItems.length} items
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package size={32} className="mx-auto mb-2 text-gray-400" aria-hidden="true" />
              <p>No server-backed packages are available yet.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageManager;

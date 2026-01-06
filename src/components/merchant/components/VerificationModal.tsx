import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, CheckCircle } from 'lucide-react';

interface VerificationData {
  storefrontPhoto: File | null;
  businessLicenseNumber: string;
}

interface ValidationErrors {
  storefrontPhoto?: string;
  businessLicenseNumber?: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState<VerificationData>({
    storefrontPhoto: null,
    businessLicenseNumber: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.storefrontPhoto) {
      newErrors.storefrontPhoto = 'Please upload a storefront photo';
    }

    if (!formData.businessLicenseNumber.trim()) {
      newErrors.businessLicenseNumber = 'Please enter your business license number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          storefrontPhoto: 'Please upload a JPEG, PNG, or WebP image'
        }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          storefrontPhoto: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, storefrontPhoto: file }));
      setErrors(prev => ({ ...prev, storefrontPhoto: undefined }));
    }
  };

  const handleLicenseNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, businessLicenseNumber: value }));
    if (errors.businessLicenseNumber && value.trim()) {
      setErrors(prev => ({ ...prev, businessLicenseNumber: undefined }));
    }
  };

  const handleCancel = () => {
    navigate('/merchant/login');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setCurrentView('success');
  };

  const handleEnterDashboard = () => {
    // Get current user info to make verification user-specific
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Create user-specific verification key
    const verificationKey = userId ? `merchantVerificationCompleted_${userId}` : 'merchantVerificationCompleted';
    
    // Mark verification as completed for this specific user
    localStorage.setItem(verificationKey, 'true');
    onClose();
  };

  // Development helper - can be called from browser console
  if (typeof window !== 'undefined') {
    (window as any).resetMerchantVerification = (userId?: string) => {
      if (userId) {
        localStorage.removeItem(`merchantVerificationCompleted_${userId}`);
        console.log(`Merchant verification status reset for user ${userId}. Refresh the page to see the modal again.`);
      } else {
        // Reset for current user
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            localStorage.removeItem(`merchantVerificationCompleted_${user.id}`);
            console.log(`Merchant verification status reset for current user ${user.id}. Refresh the page to see the modal again.`);
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        // Also reset the legacy key
        localStorage.removeItem('merchantVerificationCompleted');
        console.log('Merchant verification status reset. Refresh the page to see the modal again.');
      }
    };
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {currentView === 'form' ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 text-center">RevieU</h2>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-6">
              {/* Storefront Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Real-life Storefront Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="storefront-photo"
                  />
                  <label
                    htmlFor="storefront-photo"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      errors.storefrontPhoto 
                        ? 'border-red-300 bg-red-50' 
                        : formData.storefrontPhoto
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {formData.storefrontPhoto ? (
                      <div className="text-center">
                        <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                        <p className="text-sm text-green-700 font-medium">
                          {formData.storefrontPhoto.name}
                        </p>
                        <p className="text-xs text-green-600">Click to change</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload storefront photo</p>
                        <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.storefrontPhoto && (
                  <p className="mt-1 text-sm text-red-600">{errors.storefrontPhoto}</p>
                )}
              </div>

              {/* Business License Number */}
              <div>
                <label htmlFor="license-number" className="block text-sm font-medium text-gray-700 mb-2">
                  Business License Number
                </label>
                <input
                  type="text"
                  id="license-number"
                  value={formData.businessLicenseNumber}
                  onChange={handleLicenseNumberChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.businessLicenseNumber 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Enter your business license number"
                />
                {errors.businessLicenseNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessLicenseNumber}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 text-center">RevieU</h2>
            </div>

            {/* Success Content */}
            <div className="p-6 text-center">
              <div className="mb-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              </div>
              <p className="text-gray-700 leading-relaxed">
                Note: Your information will be reviewed within 24-48 hours. You'll receive an email notification once verification is complete.
              </p>
            </div>

            {/* Success Action */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleEnterDashboard}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Enter Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationModal;
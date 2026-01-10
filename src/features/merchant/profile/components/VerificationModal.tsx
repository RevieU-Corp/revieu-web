import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../../../routes/paths';
import { Upload, CheckCircle, Loader2, FileText, User, Building } from 'lucide-react';
import AccountSetupModal from './AccountSetupModal';

interface VerificationData {
  storefrontPhoto: File | null;
  businessLicenseNumber: string;
  ein: string;
  legalCompanyName: string;
  businessLicense: File | null;
  healthPermit: File | null;
  ownerName: string;
  ownerIdUpload: File | null;
}

interface ValidationErrors {
  storefrontPhoto?: string;
  businessLicenseNumber?: string;
  ein?: string;
  legalCompanyName?: string;
  businessLicense?: string;
  healthPermit?: string;
  ownerName?: string;
  ownerIdUpload?: string;
}

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'form' | 'pending' | 'success'>('form');
  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const [formData, setFormData] = useState<VerificationData>({
    storefrontPhoto: null,
    businessLicenseNumber: '',
    ein: '',
    legalCompanyName: '',
    businessLicense: null,
    healthPermit: null,
    ownerName: '',
    ownerIdUpload: null
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalTimer, setApprovalTimer] = useState(3);

  if (!isOpen) return null;

  // Auto-approval simulation effect
  useEffect(() => {
    if (currentView === 'pending') {
      const timer = setInterval(() => {
        setApprovalTimer((prev) => {
          if (prev <= 1) {
            setCurrentView('success');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentView]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.storefrontPhoto) {
      newErrors.storefrontPhoto = 'Please upload a storefront photo';
    }

    if (!formData.businessLicenseNumber.trim()) {
      newErrors.businessLicenseNumber = 'Please enter your business license number';
    }

    if (!formData.ein.trim()) {
      newErrors.ein = 'Please enter your EIN';
    }

    if (!formData.legalCompanyName.trim()) {
      newErrors.legalCompanyName = 'Please enter your legal company name';
    }

    if (!formData.businessLicense) {
      newErrors.businessLicense = 'Please upload your business license';
    }

    if (!formData.healthPermit) {
      newErrors.healthPermit = 'Please upload your health permit';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Please enter the owner name';
    }

    if (!formData.ownerIdUpload) {
      newErrors.ownerIdUpload = 'Please upload owner ID';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof VerificationData) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Please upload a JPEG, PNG, WebP, or PDF file'
        }));
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'File size must be less than 10MB'
        }));
        return;
      }

      setFormData(prev => ({ ...prev, [fieldName]: file }));
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleInputChange = (fieldName: keyof VerificationData, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName] && value.trim()) {
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleCancel = () => {
    navigate(PATHS.MERCHANT.LOGIN);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setCurrentView('pending');
    setApprovalTimer(3); // Reset timer
  };

  const handleEnterDashboard = () => {
    // Instead of navigating directly, show the account setup modal
    setShowAccountSetup(true);
  };

  const handleAccountSetupClose = () => {
    setShowAccountSetup(false);
    // If they close account setup, they can still access it again
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

    // Helper to create demo merchant user
    (window as any).createDemoMerchant = () => {
      const demoUser = {
        id: 'demo_merchant',
        email: 'merchant@demo.com',
        name: 'Demo Merchant',
        avatar: 'DM',
        role: 'merchant',
        merchantProfile: {
          businessId: 'demo_biz_123',
          verificationStatus: 'pending',
          subscriptionTier: 'basic',
          joinDate: new Date()
        }
      };
      
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      console.log('Demo merchant user created. Refresh the page to see the changes.');
      return demoUser;
    };

    // Helper to clear all data and start fresh
    (window as any).clearAllData = () => {
      localStorage.clear();
      console.log('All localStorage data cleared. Refresh the page to start fresh.');
    };
  }

  // Helper component for file upload fields
  const FileUploadField: React.FC<{
    id: string;
    label: string;
    file: File | null;
    error?: string;
    accept?: string;
    fieldName: keyof VerificationData;
  }> = ({ id, label, file, error, accept = "image/jpeg,image/png,image/webp,application/pdf", fieldName }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileSelect(e, fieldName)}
          className="hidden"
          id={id}
        />
        <label
          htmlFor={id}
          className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            error
              ? 'border-red-300 bg-red-50'
              : file
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          {file ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-6 w-6 text-green-500 mb-1" />
              <p className="text-xs text-green-700 font-medium truncate max-w-32">
                {file.name}
              </p>
              <p className="text-xs text-green-600">Click to change</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
              <p className="text-xs text-gray-600">Upload file</p>
              <p className="text-xs text-gray-500">PDF, JPEG, PNG (max 10MB)</p>
            </div>
          )}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {currentView === 'form' ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900 text-center">Business Verification</h2>
              <p className="text-sm text-gray-600 text-center mt-1">Complete all sections to verify your business</p>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Storefront Photo Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Real-life Storefront Photo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => handleFileSelect(e, 'storefrontPhoto')}
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
                            <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 10MB)</p>
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
                      onChange={(e) => handleInputChange('businessLicenseNumber', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.businessLicenseNumber
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter business license number"
                    />
                    {errors.businessLicenseNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.businessLicenseNumber}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Legal Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Business Legal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* EIN */}
                  <div>
                    <label htmlFor="ein" className="block text-sm font-medium text-gray-700 mb-2">
                      EIN (Employer Identification Number)
                    </label>
                    <input
                      type="text"
                      id="ein"
                      value={formData.ein}
                      onChange={(e) => handleInputChange('ein', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.ein ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="XX-XXXXXXX"
                    />
                    {errors.ein && (
                      <p className="mt-1 text-sm text-red-600">{errors.ein}</p>
                    )}
                  </div>

                  {/* Legal Company Name */}
                  <div>
                    <label htmlFor="legal-company-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Legal Company Name
                    </label>
                    <input
                      type="text"
                      id="legal-company-name"
                      value={formData.legalCompanyName}
                      onChange={(e) => handleInputChange('legalCompanyName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.legalCompanyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter legal company name"
                    />
                    {errors.legalCompanyName && (
                      <p className="mt-1 text-sm text-red-600">{errors.legalCompanyName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Document Upload</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadField
                    id="business-license"
                    label="Business License"
                    file={formData.businessLicense}
                    error={errors.businessLicense}
                    fieldName="businessLicense"
                  />
                  <FileUploadField
                    id="health-permit"
                    label="Health Permit"
                    file={formData.healthPermit}
                    error={errors.healthPermit}
                    fieldName="healthPermit"
                  />
                </div>
              </div>

              {/* Owner Verification */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Owner Verification</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Owner Name */}
                  <div>
                    <label htmlFor="owner-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="owner-name"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.ownerName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter owner's full name"
                    />
                    {errors.ownerName && (
                      <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Owner ID Upload */}
                  <FileUploadField
                    id="owner-id"
                    label="Owner ID Upload"
                    file={formData.ownerIdUpload}
                    error={errors.ownerIdUpload}
                    fieldName="ownerIdUpload"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
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
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </>
        ) : currentView === 'pending' ? (
          <>
            {/* Pending Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 text-center">Verification in Progress</h2>
            </div>

            {/* Pending Content */}
            <div className="p-6 text-center">
              <div className="mb-6">
                <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
                <p className="text-lg font-medium text-gray-900 mt-4">Pending Approval</p>
                <p className="text-gray-600 mt-2">
                  Your verification is being processed... ({approvalTimer}s)
                </p>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-700">Business License #:</p>
                      <p className="text-gray-600">{formData.businessLicenseNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">EIN:</p>
                      <p className="text-gray-600">{formData.ein}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Legal Company Name:</p>
                      <p className="text-gray-600">{formData.legalCompanyName}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Owner Name:</p>
                      <p className="text-gray-600">{formData.ownerName}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-4">
                    <p className="font-medium text-gray-700 mb-2">Uploaded Documents:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Storefront Photo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Business License</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Health Permit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Owner ID</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 text-center">Verification Approved!</h2>
            </div>

            {/* Success Content */}
            <div className="p-6 text-center">
              <div className="mb-4">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to RevieU!</h3>
              <p className="text-gray-700 leading-relaxed">
                Your business has been successfully verified. You can now access your merchant dashboard and start managing your business profile.
              </p>
            </div>

            {/* Success Action */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleEnterDashboard}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Set Up Your Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* Account Setup Modal */}
      <AccountSetupModal
        isOpen={showAccountSetup}
        onClose={handleAccountSetupClose}
      />
    </div>
  );
};

export default VerificationModal;
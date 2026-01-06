# Design Document: Merchant Verification Modal

## Overview

The Merchant Verification Modal is a mandatory overlay component that appears when merchants first access their dashboard after login. It captures essential business verification information (storefront photo and business license number) before allowing access to dashboard functionality. The modal integrates seamlessly with the existing React/TypeScript architecture using Tailwind CSS and Radix UI components.

## Architecture

### Integration Point
The verification modal will be integrated at the **MerchantLayout** level to intercept all merchant dashboard access. This ensures the modal appears regardless of which specific merchant route is accessed, providing a consistent verification gate.

### Component Hierarchy
```
MerchantLayout
├── VerificationModal (new)
│   ├── VerificationForm (initial view)
│   └── VerificationSuccess (post-submission view)
├── Header (existing)
├── Main Content (Outlet - existing)
└── BottomNavigation (existing)
```

### State Management
- **Local component state** for modal visibility and form data
- **Session/localStorage** to track verification completion status
- **Form validation state** for real-time feedback

## Components and Interfaces

### VerificationModal Component
```typescript
interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSubmit: (data: VerificationData) => void;
}

interface VerificationData {
  storefrontPhoto: File | null;
  businessLicenseNumber: string;
}
```

### VerificationForm Component
```typescript
interface VerificationFormProps {
  onCancel: () => void;
  onSubmit: (data: VerificationData) => void;
}
```

### VerificationSuccess Component
```typescript
interface VerificationSuccessProps {
  onEnterDashboard: () => void;
}
```

### File Upload Component
```typescript
interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  acceptedTypes: string[];
  maxSize: number;
  error?: string;
}
```

## Data Models

### Verification Form Data
```typescript
interface VerificationFormData {
  storefrontPhoto: File | null;
  businessLicenseNumber: string;
}

interface ValidationErrors {
  storefrontPhoto?: string;
  businessLicenseNumber?: string;
}

interface FormState {
  data: VerificationFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isValid: boolean;
}
```

### Modal State
```typescript
interface ModalState {
  isOpen: boolean;
  currentView: 'form' | 'success';
  isVerificationComplete: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties ensure the verification modal behaves correctly:

**Property 1: Automatic Modal Display**
*For any* merchant navigation to /merchant/dashboard, the verification modal should automatically appear as an overlay with the underlying dashboard visible but not interactive.
**Validates: Requirements 1.1, 1.2**

**Property 2: Cancel Navigation Flow**
*For any* Cancel button click, the system should navigate to /merchant/login and dismiss the verification modal.
**Validates: Requirements 3.1, 3.2**

**Property 3: Form Validation Prevention**
*For any* form submission attempt with missing required fields (storefront photo or business license number), the submission should be prevented and validation feedback should be displayed.
**Validates: Requirements 6.1, 6.2**

**Property 4: File Type Validation**
*For any* file upload attempt, valid image formats (JPEG, PNG, WebP) should be accepted and invalid file types should trigger appropriate error messages.
**Validates: Requirements 5.1, 5.2**

**Property 5: Success View Transition**
*For any* valid form submission, the modal content should transition to the success view displaying the confirmation message and "Enter Dashboard" button.
**Validates: Requirements 4.1, 4.2, 4.3**

**Property 6: Dashboard Access Restoration**
*For any* "Enter Dashboard" button click after successful submission, the modal should be dismissed and the merchant should be able to interact with the dashboard.
**Validates: Requirements 4.4, 4.5**

**Property 7: Business License Input Validation**
*For any* alphanumeric input in the Business License Number field, the input should be accepted and the submit button should be enabled when all required fields are completed.
**Validates: Requirements 6.3, 6.4**

**Property 8: File Selection Feedback**
*For any* valid image file selection, the system should provide visual feedback through preview or confirmation display.
**Validates: Requirements 5.3, 5.4**

## Error Handling

### File Upload Errors
- **Invalid file type**: Display "Please upload a valid image file (JPEG, PNG, or WebP)"
- **File too large**: Display "File size must be less than 5MB"
- **Upload failure**: Display "Upload failed. Please try again"

### Form Validation Errors
- **Missing storefront photo**: Display "Storefront photo is required"
- **Missing business license**: Display "Business license number is required"
- **Invalid license format**: Display "Please enter a valid business license number"

### Network Errors
- **Submission failure**: Display "Submission failed. Please check your connection and try again"
- **Timeout**: Display "Request timed out. Please try again"

### Error Recovery
- All errors should be dismissible
- Form should retain valid data after error correction
- Users can retry failed operations without losing progress

## Testing Strategy

### Unit Testing
- **Component rendering**: Verify modal renders correctly in both form and success states
- **Form validation**: Test validation logic for required fields and file types
- **Event handling**: Test button clicks, form submissions, and navigation actions
- **Error states**: Test error message display and error recovery flows

### Property-Based Testing
Using **React Testing Library** with **@fast-check/jest** for property-based testing:

- **Property tests**: Verify universal properties hold across all inputs (minimum 100 iterations each)
- **Form validation properties**: Test validation logic with generated form data
- **File upload properties**: Test file validation with generated file objects
- **Navigation properties**: Test routing behavior with various user actions

### Integration Testing
- **Modal integration**: Test modal appearance on dashboard navigation
- **Form submission flow**: Test complete form submission and success flow
- **Navigation integration**: Test Cancel and Enter Dashboard navigation
- **Persistence testing**: Test verification completion tracking

### Testing Configuration
- Each property test runs minimum 100 iterations
- Tests tagged with format: **Feature: merchant-verification-modal, Property {number}: {property_text}**
- Mock file uploads and navigation for isolated testing
- Test both happy path and error scenarios

## Implementation Notes

### Accessibility
- Modal should trap focus within the component
- Proper ARIA labels for form fields and buttons
- Keyboard navigation support
- Screen reader compatibility

### Performance
- Lazy load modal component to reduce initial bundle size
- Optimize image preview generation
- Debounce form validation for better UX

### Security
- Client-side file type validation (server-side validation required)
- File size limits to prevent abuse
- Sanitize business license number input

### Browser Compatibility
- Support modern browsers with ES2020+ features
- Graceful degradation for older browsers
- Mobile-responsive design using Tailwind breakpoints
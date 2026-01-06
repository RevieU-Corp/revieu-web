# Redemption Feature Setup

## Installation

To enable QR code scanning functionality, install the required dependency:

```bash
npm install html5-qrcode@^2.3.8
```

## Features

The Redemption feature includes:

### Device Detection
- Automatically detects mobile vs desktop devices
- Uses user agent, touch capabilities, and screen size

### Mobile Experience
- **Scan Button**: Shows QR code icon in header
- **Camera Scanner**: Opens html5-qrcode camera interface
- **Fallback**: Manual entry option if camera fails

### Desktop Experience  
- **Redeem Button**: Shows keyboard icon in header
- **Manual Entry**: Clean input form for typing codes
- **Auto-formatting**: Converts codes to uppercase

### Mock Coupon Codes
Test with these sample codes:
- `STUDENT20` - Student Special (20% Off)
- `SAVE15` - Save $15 ($15 Off) 
- `FINALS2024` - Finals Week Deal ($5 Off)
- `LATENIGHT` - Late Night Special (Buy 1 Get 1)
- `EXPIRED123` - Expired coupon (will show error)

## Usage

1. Navigate to any merchant page
2. Look for the Redemption button in the top-right header
3. On mobile: Click "Scan" to open camera
4. On desktop: Click "Redeem" to enter code manually
5. Success/error messages appear as toast notifications

## Technical Details

- **Responsive Design**: Adapts UI based on device type
- **Camera Permissions**: Requests camera access on mobile
- **Error Handling**: Graceful fallbacks for camera issues
- **Toast Notifications**: 5-second auto-dismiss results
- **Code Validation**: Checks against mock coupon database
declare module 'html5-qrcode' {
  export interface Html5QrcodeConfig {
    fps?: number;
    qrbox?: { width: number; height: number } | number;
    aspectRatio?: number;
    disableFlip?: boolean;
  }

  export interface CameraDevice {
    id: string;
    label: string;
  }

  export class Html5Qrcode {
    constructor(elementId: string);
    
    start(
      cameraIdOrConfig: string | { facingMode: string },
      config: Html5QrcodeConfig,
      qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): Promise<void>;
    
    stop(): Promise<void>;
    
    static getCameras(): Promise<CameraDevice[]>;
  }

  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: Html5QrcodeConfig,
      verbose?: boolean
    );
    
    render(
      qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): void;
    
    clear(): void;
  }
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'merchant';
  merchantProfile?: MerchantProfile;
}

interface MerchantProfile {
  businessId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  joinDate: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMerchant: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would normally make an API call
    // For now, we'll simulate a successful login with role detection
    console.log('Login attempt for:', email, 'with password length:', password.length);
    
    // Simulate role detection based on email domain or other logic
    // For demo purposes, make it easier to test merchant access
    const isMerchantEmail = email.includes('business') || 
                           email.includes('merchant') || 
                           email.includes('shop') ||
                           email.includes('admin') ||
                           email === 'merchant@test.com';
    
    const mockUser: User = {
      id: '1',
      email: email,
      name: isMerchantEmail ? 'Business Owner' : 'Tommy Trojan',
      avatar: isMerchantEmail ? 'BO' : 'TJ',
      role: isMerchantEmail ? 'merchant' : 'user',
      ...(isMerchantEmail && {
        merchantProfile: {
          businessId: 'biz_123',
          verificationStatus: 'verified' as const,
          subscriptionTier: 'basic' as const,
          joinDate: new Date()
        }
      })
    };
    
    setUser(mockUser);
    localStorage.setItem('authToken', 'mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isMerchant: user?.role === 'merchant',
    login,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
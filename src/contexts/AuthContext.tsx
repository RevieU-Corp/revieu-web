import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../features/auth/api/authService';
import { userService } from '../api/userService';

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Validate token on app start
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          // Validate token by calling /auth/me
          const response = await authService.getMe();
          const userData = response.data;

          // Try to get profile data for avatar and other info
          let profileData = null;
          try {
            const profileResponse = await userService.getProfile();
            profileData = profileResponse.data;
          } catch (profileError) {
            console.log('Profile data not available:', profileError);
          }

          // Transform backend user data to frontend User format
          const transformedUser: User = {
            id: userData.user_id.toString(),
            email: userData.email,
            name: profileData?.nickname || userData.email.split('@')[0],
            avatar: profileData?.avatar_url,
            role: (userData.role === 'merchant' ? 'merchant' : 'user') as 'user' | 'merchant',
          };

          setUser(transformedUser);
          localStorage.setItem('user', JSON.stringify(transformedUser));
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Call real backend API
      const response = await authService.login({ email, password });
      const { token } = response.data;

      // Store token
      localStorage.setItem('authToken', token);

      // Fetch user profile
      const userResponse = await authService.getMe();
      const userData = userResponse.data;

      // Try to get profile data for avatar and other info
      let profileData = null;
      try {
        const profileResponse = await userService.getProfile();
        profileData = profileResponse.data;
      } catch (profileError) {
        console.log('Profile data not available:', profileError);
      }

      // Transform backend user data to frontend User format
      const transformedUser: User = {
        id: userData.user_id.toString(),
        email: userData.email,
        name: profileData?.nickname || userData.email.split('@')[0],
        avatar: profileData?.avatar_url,
        role: (userData.role === 'merchant' ? 'merchant' : 'user') as 'user' | 'merchant',
      };

      setUser(transformedUser);
      localStorage.setItem('user', JSON.stringify(transformedUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
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


import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  wallet_address?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  onboarded: boolean;
  created_at: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const privyAuth = usePrivy();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider: Privy auth state:', {
    authenticated: privyAuth?.authenticated,
    user: privyAuth?.user?.id,
    ready: privyAuth?.ready
  });

  // Safely destructure Privy auth with fallbacks
  const { 
    user = null, 
    authenticated = false, 
    login: privyLogin = () => Promise.resolve(), 
    logout: privyLogout = () => {},
    ready = false
  } = privyAuth || {};

  // Enhanced login function with better error handling
  const login = async () => {
    console.log('AuthContext: Starting login process...');
    
    if (!privyAuth) {
      console.error('AuthContext: Privy not initialized');
      throw new Error('Privy authentication not available');
    }

    try {
      console.log('AuthContext: Calling privyLogin...');
      await privyLogin();
      console.log('AuthContext: privyLogin completed');
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  // Create or fetch user profile when authenticated
  useEffect(() => {
    const handleAuthState = async () => {
      console.log('AuthContext: Handling auth state change', { authenticated, user: user?.id });
      
      if (authenticated && user) {
        try {
          // Check if profile exists
          const { data: existingProfile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            setIsLoading(false);
            return;
          }

          if (existingProfile) {
            console.log('AuthContext: Found existing profile');
            setProfile(existingProfile);
          } else {
            console.log('AuthContext: Creating new profile');
            // Create new profile
            const newProfile = {
              id: user.id,
              email: user.email?.address || '',
              wallet_address: user.wallet?.address || '',
              first_name: '',
              last_name: '',
              avatar_url: '',
              onboarded: false
            };

            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
            } else {
              console.log('AuthContext: Created new profile');
              setProfile(createdProfile);
            }
          }
        } catch (error) {
          console.error('Auth state error:', error);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    // Only run if privyAuth is available and ready
    if (privyAuth && ready) {
      handleAuthState();
    } else if (ready) {
      setIsLoading(false);
    }
  }, [authenticated, user, privyAuth, ready]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    await updateProfile({ onboarded: true });
  };

  const value = {
    user,
    profile,
    isAuthenticated: authenticated,
    isLoading,
    login,
    logout: privyLogout,
    updateProfile,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

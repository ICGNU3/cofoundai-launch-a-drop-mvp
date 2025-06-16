
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { UserProfile } from './UserProfile';
import { OnboardingModal } from './OnboardingModal';
import { User } from 'lucide-react';

export const AuthButton: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Safely use auth context with error boundary
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error:', error);
    return (
      <Button variant="outline" disabled className="gap-2">
        <User className="w-4 h-4" />
        Auth Error
      </Button>
    );
  }

  const { isAuthenticated, profile, isLoading } = authData;

  React.useEffect(() => {
    if (isAuthenticated && profile && !profile.onboarded) {
      setShowOnboardingModal(true);
    }
  }, [isAuthenticated, profile]);

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <div className="w-4 h-4 bg-text/20 rounded-full animate-pulse" />
        Loading...
      </Button>
    );
  }

  if (isAuthenticated && profile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowProfileModal(true)}
          className="gap-2 bg-surface border-border hover:bg-surface/80"
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-accent text-black text-xs">
              {(profile.first_name?.[0] || profile.email[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">
            {profile.first_name || 'Profile'}
          </span>
        </Button>
        
        <UserProfile 
          isOpen={showProfileModal} 
          onClose={() => setShowProfileModal(false)} 
        />
        <OnboardingModal 
          isOpen={showOnboardingModal} 
          onClose={() => setShowOnboardingModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        className="bg-accent text-black hover:bg-accent/90 gap-2"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

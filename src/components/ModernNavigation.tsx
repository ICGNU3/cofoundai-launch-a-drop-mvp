import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './auth/AuthModal'
import { UserProfile } from './auth/UserProfile'
import { OnboardingModal } from './auth/OnboardingModal'
import { User, Menu } from 'lucide-react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const ModernNavigation: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Safely use auth context with error boundary
  let authData
  try {
    authData = useAuth()
  } catch (error) {
    console.error('Auth context error:', error)
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <div className="h-6 w-6 bg-accent rounded-sm" />
              <span className="hidden font-bold sm:inline-block">NEPLUS</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
              <Link
                to="/trading"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Trading
              </Link>
              <Link
                to="/how-it-works"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                How it Works
              </Link>
              {import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' && (
                <Link
                  to="/dev"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Dev Tools
                </Link>
              )}
            </nav>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" disabled className="gap-2">
              <User className="w-4 h-4" />
              Auth Error
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  const { isAuthenticated, profile, isLoading } = authData

  React.useEffect(() => {
    if (isAuthenticated && profile && !profile.onboarded) {
      setShowOnboardingModal(true)
    }
  }, [isAuthenticated, profile])

  const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    return (
      <div
        className={`fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col items-center justify-center transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col items-center gap-4 text-lg">
          <Link
            to="/dashboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={onClose}
          >
            Dashboard
          </Link>
          <Link
            to="/trading"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={onClose}
          >
            Trading
          </Link>
          <Link
            to="/how-it-works"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
            onClick={onClose}
          >
            How it Works
          </Link>
          {import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' && (
            <Link
              to="/dev"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={onClose}
            >
              Dev Tools
            </Link>
          )}
        </nav>
      </div>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-accent rounded-sm" />
            <span className="hidden font-bold sm:inline-block">NEPLUS</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              to="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              to="/trading"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Trading
            </Link>
            <Link
              to="/how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              How it Works
            </Link>
            {import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' && (
              <Link
                to="/dev"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dev Tools
              </Link>
            )}
          </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {isLoading ? (
            <Button variant="outline" disabled className="gap-2">
              <div className="w-4 h-4 bg-text/20 rounded-full animate-pulse" />
              Loading...
            </Button>
          ) : isAuthenticated && profile ? (
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
                <span className="hidden sm:inline">{profile.first_name || 'Profile'}</span>
              </Button>

              <UserProfile isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
              <OnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
            </>
          ) : (
            <>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-accent text-black hover:bg-accent/90 gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>

              <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </nav>
  )
}

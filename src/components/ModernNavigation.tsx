import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const ModernNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-headline">NEPLUS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-text hover:text-accent transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/trading" 
              className="text-text hover:text-accent transition-colors"
            >
              Trading Hub
            </Link>
            <Link 
              to="/farcaster" 
              className="text-text hover:text-accent transition-colors"
            >
              Social Trading
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-text hover:text-accent transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-text hover:text-accent transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* User Menu (Placeholder) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Add user authentication and menu here */}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/dashboard" 
                className="text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/trading" 
                className="text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Trading Hub
              </Link>
              <Link 
                to="/farcaster" 
                className="text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Social Trading
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-text hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavigation;

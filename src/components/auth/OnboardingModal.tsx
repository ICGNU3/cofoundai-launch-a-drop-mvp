
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, completeOnboarding } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });

  const handleNext = () => {
    if (step === 1 && (!formData.first_name || !formData.last_name)) {
      toast({
        title: "Required Fields",
        description: "Please fill in your first and last name.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    try {
      await updateProfile(formData);
      await completeOnboarding();
      toast({
        title: "Welcome to NEPLUS!",
        description: "Your account setup is complete.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profile || profile.onboarded) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Welcome to NEPLUS</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {step === 1 && (
            <>
              <div className="text-center">
                <div className="text-sm text-text/70 mb-4">
                  Let's get your profile set up so you can start creating and trading.
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full bg-accent text-black hover:bg-accent/90">
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold">You're all set!</h3>
                  <p className="text-sm text-text/70">
                    Welcome to NEPLUS, {formData.first_name}! You can now:
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>Create and launch content drops</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>Trade tokens on social platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>Earn royalties from your content</span>
                </div>
              </div>

              <Button onClick={handleComplete} className="w-full bg-accent text-black hover:bg-accent/90">
                Start Creating
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

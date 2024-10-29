import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useUserContext } from '@/context/AuthContext';
import { account } from '@/lib/appwrite/config';
import { useToast } from '@/hooks/use-toast';

const VerificationBanner = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const currentAccount = await account.get();
        setShowBanner(!currentAccount.emailVerification);
      } catch (error) {
        console.error("Error checking verification:", error);
      }
    };

    // Check verification status when component mounts and when user changes
    if (user?.email) {
      checkVerification();
    }

    // Check verification status every 30 seconds
    const interval = setInterval(() => {
      if (user?.email) {
        checkVerification();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.email]);

  if (!showBanner) return null;

  const handleVerifyClick = async () => {
    setIsLoading(true);
    try {
      await account.createVerification(
        `${window.location.origin}/verify`
      );
      navigate('/verify-email', { 
        state: { 
          email: user.email
        } 
      });
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      if (error.code === 409) {
        setShowBanner(false);
        toast({
          title: "Already Verified",
          description: "Your email is already verified.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send verification email. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-dark-4 py-2 sm:py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 z-50 border-b border-dark-3">
      <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
        <img 
          src="/assets/icons/chat.svg" 
          alt="warning" 
          className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
        />
        <p className="text-light-2 text-xs sm:text-base">
          <span className="font-bold">{user.email}</span> is not verified. 
          Please verify your email to access all features.
        </p>
      </div>
      <Button
        onClick={handleVerifyClick}
        disabled={isLoading}
        className="shad-button_primary flex items-center gap-2 w-full sm:w-auto"
      >
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            Verify Now
          </>
        )}
      </Button>
    </div>
  );
};

export default VerificationBanner;
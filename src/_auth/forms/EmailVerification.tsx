import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { account } from '@/lib/appwrite/config';
import { useState, useEffect } from 'react';
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { deleteUserAndSession } from '@/lib/appwrite/api';

const EmailVerification = () => {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsAuthenticated } = useUserContext();
  const email = location.state?.email;
  const userId = location.state?.userId;

  useEffect(() => {
    if (!email) {
      navigate('/sign-in');
      return;
    }

    const checkVerification = async () => {
      try {
        const currentAccount = await account.get();
        if (currentAccount.emailVerification) {
          setIsAuthenticated(true);
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully",
          });
          navigate('/');
          return;
        }
      } catch (error) {
        console.error("Error checking verification:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkVerification();

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Check verification status every 3 seconds
    const verificationCheck = setInterval(checkVerification, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(verificationCheck);
    };
  }, [email, navigate, setIsAuthenticated, toast]);

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    try {
      await account.createVerification(`${window.location.origin}/verify`);
      setCountdown(60);
      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error) {
      console.error("Error resending verification:", error);
      toast({
        title: "Failed to resend",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleWrongEmail = async () => {
    if (!userId) return;
    
    setIsDeleting(true);
    try {
      // Delete everything from database first
      const deleted = await deleteUserAndSession(userId);
      
      if (deleted) {
        // Only after database cleanup, delete the session
        await account.deleteSessions();
        
        toast({
          title: "Account cleaned up",
          description: "You can now create a new account with the correct email",
        });
        // Clear any stored credentials
        localStorage.removeItem('tempPassword');
        navigate('/sign-up');
      } else {
        throw new Error("Failed to cleanup account");
      }
    } catch (error) {
      console.error("Error cleaning up account:", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex-center flex-col gap-5 p-8 max-w-md w-full bg-dark-2 rounded-xl">
        <Loader />
        <p className="text-light-2">Checking verification status...</p>
      </div>
    );
  }

  return (
    <div className="flex-center flex-col gap-5 p-8 max-w-md w-full bg-dark-2 rounded-xl">
      <h2 className="h3-bold md:h2-bold text-center">Verify your email</h2>
      <p className="text-light-2 small-medium md:base-regular text-center">
        We sent a verification link to<br />
        <span className="font-bold">{email}</span>
      </p>

      <Button 
        className="shad-button_primary w-full"
        onClick={handleResendEmail}
        disabled={countdown > 0 || isResending}
      >
        {isResending ? (
          <div className="flex-center gap-2">
            <Loader /> Sending...
          </div>
        ) : countdown > 0 ? (
          `Resend in ${countdown}s`
        ) : (
          "Resend verification email"
        )}
      </Button>

      <p className="text-light-2 text-small-regular text-center">
        Wrong email? <button
          onClick={handleWrongEmail}
          disabled={isDeleting}
          className="text-primary-500 hover:underline disabled:opacity-50"
        >
          {isDeleting ? "Cleaning up..." : "Try again"}
        </button>
      </p>
    </div>
  );
};

export default EmailVerification;
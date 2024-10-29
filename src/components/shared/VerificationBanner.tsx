import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useUserContext } from '@/context/AuthContext';
import { account } from '@/lib/appwrite/config';
import { useToast } from '@/hooks/use-toast';
import Loader from './Loader';

const VerificationBanner = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex-center flex-col h-screen w-full bg-dark-1 px-5">
      <div className="max-w-md w-full bg-dark-2 rounded-2xl p-8 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="h3-bold md:h2-bold mb-2">Verify Your Email</h1>
          <p className="text-light-2 small-medium md:base-regular">
            We sent a verification email to<br />
            <span className="font-bold text-light-1">{user.email}</span>
          </p>
        </div>

        <Button
          onClick={handleVerifyClick}
          disabled={isLoading}
          className="shad-button_primary w-full"
        >
          {isLoading ? (
            <div className="flex-center gap-2">
              <Loader /> Sending...
            </div>
          ) : (
            "Resend Verification Email"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VerificationBanner;
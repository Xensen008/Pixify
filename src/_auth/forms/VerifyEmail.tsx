import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { account } from '@/lib/appwrite/config';
import { useUserContext } from '@/context/AuthContext';

const VerifyEmail = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated } = useUserContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');

    const verifyEmail = async () => {
      if (!userId || !secret) {
        toast({
          title: "Invalid Link",
          description: "The verification link is invalid or expired",
          variant: "destructive"
        });
        navigate('/sign-in');
        return;
      }

      try {
        await account.updateVerification(userId, secret);
        
    
        const currentAccount = await account.get();
        
        if (currentAccount.emailVerification) {
          setIsAuthenticated(true);
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully",
          });
          navigate('/');
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast({
          title: "Verification Failed",
          description: "Please try again or contact support",
          variant: "destructive"
        });
        navigate('/sign-in');
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex-center flex-col gap-4 p-8 max-w-md w-full bg-dark-2 rounded-xl">
      <img 
        src="/assets/icons/email-verify.svg" 
        alt="email" 
        className="w-24 h-24"
      />
      <h2 className="h3-bold md:h2-bold text-center">Verifying your email...</h2>
      <p className="text-light-2 small-medium md:base-regular text-center">
        Please wait while we verify your email address.
      </p>
    </div>
  );
};

export default VerifyEmail;
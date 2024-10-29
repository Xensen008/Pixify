import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import VerificationBanner from "@/components/shared/VerificationBanner";
import { useUserContext } from "@/context/AuthContext";
import { account } from "@/lib/appwrite/config";

const RootLayout = () => {
  const { user } = useUserContext();
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      if (user?.id) {
        try {
          const currentAccount = await account.get();
          setIsVerified(currentAccount.emailVerification);
        } catch (error) {
          console.error("Error checking verification:", error);
        }
      }
    };
    
    checkVerification();
  }, [user?.id]);

  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        {!isVerified && <VerificationBanner />}
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
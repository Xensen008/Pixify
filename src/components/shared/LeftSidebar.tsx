import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { INavLink } from "@/types";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";


const LeftSidebar = () => {
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess)
      navigate("/sign-in")
  }, [isSuccess, navigate])
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-8">
        <Link to='/' className="flex gap-2 items-center">
          <img src="/assets/images/logo.svg" alt="logo"
            width={130}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-2 items-center max-lg:hidden">
          <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile" className="rounded-full w-10 h-10" />
          <div className="flex flex-col">
            <p className="text-10 body-bold">
              {user.name}
            </p>
            <p className="small-regular text-light-3">
              @{user.username}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-5">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500 rounded-lg'}`}>
                <NavLink
                  to={link.route}
                  key={link.label}
                  className={`flex gap-2 items-center p-3 '}`}
                >
                  <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white transition-all duration-300 ${isActive && 'invert-white'}`} />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
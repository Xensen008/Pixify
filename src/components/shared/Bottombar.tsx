
import { bottombarLinks } from "@/constants";
import { useLocation, Link } from "react-router-dom"

const Bottombar = () => {
  const {pathname }= useLocation();
  return (

    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
                <Link
                  to={link.route}
                  key={link.label}
                  className={`${isActive && 'bg-primary-500 rounded-lg'} flex-center flex-col gap-1 pb-1 pt-2 px-2`}
                >
                  <img src={link.imgURL} width={16} height={16} alt={link.label} className={`${isActive && 'invert-white'}`} />
                  <p className="text-tiny text-light-2" >{link.label}</p>
                </Link>

            )
          })}
    </section>
  )
}

export default Bottombar
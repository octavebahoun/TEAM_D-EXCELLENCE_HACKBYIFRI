import { Link, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { LayoutGrid, Users, MessageSquare, LogOut, Shield } from "lucide-react";
import logoSvg from "../assets/logo.svg";
import logoDarkSvg from "../assets/logo-dark.svg";

const Navbar = () => {
  const location = useLocation();
  const role = authService.getRole();
  const user = authService.getCurrentUser();

  if (
    !user ||
    location.pathname === "/login" ||
    location.pathname === "/register"
  )
    return null;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-8">
        <Link to="/" className="flex items-center">
          <img src={logoDarkSvg} alt="AcademiX" className="h-10 w-auto" />
        </Link>

        <div className="flex flex-wrap gap-2">
          {role === "super_admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname.startsWith("/admin") ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <Shield size={16} /> Admin
            </Link>
          )}

          <Link
            to="/chat"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${location.pathname === "/chat" ? "bg-indigo-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <MessageSquare size={16} /> Communauté
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-white">
            {user.nom} {user.prenom}
          </p>
          <p className="text-[10px] text-indigo-400 uppercase tracking-widest">
            {role}
          </p>
        </div>
        <button
          onClick={() => authService.logout()}
          className="p-2 text-slate-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

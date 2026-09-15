import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RouteLinks } from "@/constants/routes";
import Button from "@/components/ui/Button";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(RouteLinks.Login);
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-16 sm:w-20 bg-white dark:bg-[#050811] border-r border-slate-200 dark:border-[#141c2e] flex-col items-center justify-between py-6 z-60 transition-colors">
      <div className="flex flex-col items-center gap-4">
        <div
          className="group relative w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-semibold border border-teal-500/20 cursor-pointer hover:scale-105 transition-all"
        >
          <User className="w-5 h-5" />
          <div className="absolute left-full top-0 ml-3 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl border border-slate-700/60 dark:border-slate-700 z-[70]">
            <div className="font-semibold text-slate-100">{user?.name || "Gamer"}</div>
            <div className="text-[10px] text-teal-400 font-medium">Gamer</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          aria-label="Logout"
          className="group relative w-10 h-10 rounded-2xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl border border-slate-700/60 dark:border-slate-700 z-[70]">
            Logout
          </div>
        </Button>
      </div>
    </aside>
  );
}

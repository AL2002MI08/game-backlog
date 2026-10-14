import { useState } from "react";
import { Gamepad2, Sun, Moon, Menu, X } from "lucide-react";
import { RouteLinks } from "@/constants/routes";
import { Link, NavLink } from "react-router-dom";
import { useColorMode } from "@/components/ui/ColorMode";
import Button from "@/components/ui/Button";

interface NavbarProps {
  onAddGame?: () => void;
}


export default function Navbar({ onAddGame }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#050811]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#141c2e] text-slate-900 dark:text-slate-100 transition-colors">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <Link to={RouteLinks.GameOverview} className="flex items-center gap-2.5 shrink-0 group">
              <Gamepad2 className="w-7 h-7 text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">GAME</span>
                <span className="text-[9px] font-black tracking-[0.22em] text-teal-600 dark:text-teal-400 uppercase -mt-0.5">BACKLOG</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <NavLink to={RouteLinks.GameOverview} className="hover:text-teal-300">
              Games
            </NavLink>
            <Button variant="secondary" size="sm" onClick={onAddGame}>
              Add Game
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleColorMode} aria-label="Toggle theme">
              {colorMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleColorMode} aria-label="Toggle theme">
              {colorMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#141c2e] bg-white dark:bg-[#070c17] px-4 py-3 space-y-2">
            <NavLink
              to={RouteLinks.GameOverview}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center hover:text-teal-300"
            >
              Games
            </NavLink>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onAddGame?.();
              }}
            > Add Game
            </Button>

          </div>
        )}
      </header>
    </>
  );
}


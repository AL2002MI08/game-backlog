import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Nav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

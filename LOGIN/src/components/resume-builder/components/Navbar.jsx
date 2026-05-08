import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/app">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/app" className="text-slate-600 hover:text-slate-800">
            Dashboard
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DropletIcon, UsersIcon, FolderIcon, FileTextIcon, MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Início", icon: <DropletIcon className="w-5 h-5" /> },
    { path: "/pessoas", label: "Pessoas", icon: <UsersIcon className="w-5 h-5" /> },
    { path: "/projetos", label: "Projetos", icon: <FolderIcon className="w-5 h-5" /> },
    { path: "/contratos", label: "Contratos", icon: <FileTextIcon className="w-5 h-5" /> },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed w-full top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <DropletIcon className="w-8 h-8 text-agua-600" />
              <span className="text-xl font-bold text-gray-900">AguaProj</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? (
              <XIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <MenuIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-agua-50 text-agua-700"
                    : "text-gray-600 hover:text-agua-600 hover:bg-gray-50"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-2 px-4 shadow-sm">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-agua-50 text-agua-700"
                    : "text-gray-600 hover:text-agua-600 hover:bg-gray-50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;

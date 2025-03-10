
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DropletIcon, UsersIcon, FolderIcon, FileTextIcon } from "lucide-react";

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/", label: "Início", icon: <DropletIcon className="w-5 h-5" /> },
    { path: "/pessoas", label: "Pessoas", icon: <UsersIcon className="w-5 h-5" /> },
    { path: "/projetos", label: "Projetos", icon: <FolderIcon className="w-5 h-5" /> },
    { path: "/contratos", label: "Contratos", icon: <FileTextIcon className="w-5 h-5" /> },
  ];

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
          
          <nav className="flex items-center space-x-1">
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
    </header>
  );
};

export default NavBar;

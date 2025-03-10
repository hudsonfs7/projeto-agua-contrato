
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropletIcon, ArrowLeftIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6 flex justify-center">
          <DropletIcon className="h-16 w-16 text-agua-600" />
        </div>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

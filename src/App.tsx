
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pessoas from "./pages/Pessoas";
import PessoasForm from "./pages/PessoasForm";
import Projetos from "./pages/Projetos";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavBar />
        <div className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pessoas" element={<Pessoas />} />
            <Route path="/pessoas/novo" element={<PessoasForm />} />
            <Route path="/pessoas/:id" element={<PessoasForm />} />
            <Route path="/projetos" element={<Projetos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

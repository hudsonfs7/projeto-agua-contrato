
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Projeto, Pessoa, StatusProjeto, MOCK_PROJETOS, MOCK_PESSOAS, STATUS_PROJETO_MAP } from "@/types";
import NavBar from "@/components/NavBar";
import { PlusIcon, SearchIcon } from "lucide-react";
import ProjetoCard from "@/components/ProjetoCard";
import { toast } from "sonner";
import ProjetoForm from "@/components/ProjetoForm";

const Projetos = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(MOCK_PROJETOS);
  const [pessoas] = useState<Pessoa[]>(MOCK_PESSOAS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusProjeto | "todos">("todos");
  const [showForm, setShowForm] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState<Projeto | undefined>(undefined);

  // Conectar responsáveis aos projetos
  const projetosComRelacionamentos = projetos.map(projeto => ({
    ...projeto,
    responsavel: pessoas.find(p => p.id === projeto.responsavelId),
  }));

  const handleSaveProjeto = (projeto: Projeto) => {
    if (projetoParaEditar) {
      // Atualizar projeto existente
      setProjetos(prevProjetos => 
        prevProjetos.map(p => (p.id === projeto.id ? projeto : p))
      );
      toast.success("Projeto atualizado com sucesso!");
    } else {
      // Adicionar novo projeto
      setProjetos(prevProjetos => [...prevProjetos, projeto]);
      toast.success("Projeto adicionado com sucesso!");
    }
    
    // Resetar o estado
    setShowForm(false);
    setProjetoParaEditar(undefined);
  };

  // Filtragem de projetos
  const projetosFiltrados = projetosComRelacionamentos.filter(projeto => {
    const termMatch = projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                     projeto.numeroEVTE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     projeto.cidade.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filtroStatus === "todos") return termMatch;
    return termMatch && projeto.status === filtroStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="container mx-auto px-4 pt-24 pb-16 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projetos</h1>
            <p className="text-gray-500">
              Gerencie seus projetos de redes de água e esgoto.
            </p>
          </div>
          
          <Button onClick={() => { setProjetoParaEditar(undefined); setShowForm(true); }}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </div>

        {showForm ? (
          <div className="mb-10 animate-slide-in">
            <ProjetoForm 
              onSave={handleSaveProjeto} 
              projetoInicial={projetoParaEditar} 
              pessoas={pessoas}
            />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => { setShowForm(false); setProjetoParaEditar(undefined); }}
              >
                Cancelar e Voltar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar projetos por título, EVTE ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filtroStatus}
                onValueChange={(value) => setFiltroStatus(value as StatusProjeto | "todos")}
                className="w-full md:w-64"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {Object.entries(STATUS_PROJETO_MAP).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {projetosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projetosFiltrados.map((projeto) => (
                  <ProjetoCard key={projeto.id} projeto={projeto} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
                <h3 className="text-lg font-medium mb-2">Nenhum projeto encontrado</h3>
                <p className="text-gray-500 mb-6">
                  Não encontramos projetos com os filtros informados.
                </p>
                <Button onClick={() => { setProjetoParaEditar(undefined); setShowForm(true); }}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Criar Novo Projeto
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projetos;

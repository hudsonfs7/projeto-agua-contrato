
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Projeto, Pessoa, StatusProjeto, MOCK_PROJETOS, MOCK_PESSOAS, STATUS_PROJETO_MAP } from "@/types";
import { PlusIcon, SearchIcon } from "lucide-react";
import ProjetoCard from "@/components/ProjetoCard";
import { toast } from "sonner";
import ProjetoForm from "@/components/ProjetoForm";

const Projetos = () => {
  const [projetos, setProjetos] = useState<Projeto[]>(MOCK_PROJETOS);
  const [pessoas] = useState<Pessoa[]>(MOCK_PESSOAS);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtragem de projetos por termo de busca
  const projetosFiltrados = projetosComRelacionamentos.filter(projeto => 
    projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    projeto.numeroEVTE.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar projetos por status
  const projetosPorStatus = Object.keys(STATUS_PROJETO_MAP).reduce((acc, status) => {
    acc[status as StatusProjeto] = projetosFiltrados.filter(
      projeto => projeto.status === status
    );
    return acc;
  }, {} as Record<StatusProjeto, Projeto[]>);

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar projetos por título, EVTE ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {projetosFiltrados.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-1 overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                  {Object.entries(STATUS_PROJETO_MAP).map(([status, { label, color }]) => (
                    <div key={status} className="w-80 flex-shrink-0">
                      <div className={`px-3 py-2 rounded-md mb-3 font-medium ${color}`}>
                        {label} ({projetosPorStatus[status as StatusProjeto]?.length || 0})
                      </div>

                      <div className="space-y-4 min-h-[200px]">
                        {projetosPorStatus[status as StatusProjeto]?.length > 0 ? (
                          projetosPorStatus[status as StatusProjeto].map(projeto => (
                            <div 
                              key={projeto.id} 
                              className="cursor-pointer"
                              onClick={() => {
                                setProjetoParaEditar(projeto);
                                setShowForm(true);
                              }}
                            >
                              <ProjetoCard projeto={projeto} />
                            </div>
                          ))
                        ) : (
                          <div className="bg-white border border-gray-100 rounded-lg p-4 text-center text-gray-400">
                            Sem projetos
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Projetos;

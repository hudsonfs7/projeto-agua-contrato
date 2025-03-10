
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import { generateContract } from "@/utils/contratoGenerator";
import { MOCK_PROJETOS } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const ContratoForm = () => {
  const { id, action } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contrato, setContrato] = useState<string>("");
  
  const projeto = MOCK_PROJETOS.find(p => p.id === id);
  
  useEffect(() => {
    if (!projeto) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar projeto",
        description: "Projeto não encontrado",
      });
      navigate("/contratos");
      return;
    }

    // Gerar o contrato baseado no projeto
    const contratoGerado = generateContract(projeto);
    setContrato(contratoGerado);
  }, [id, projeto, navigate, toast]);

  if (!projeto) return null;

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([contrato], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Contrato_${projeto.numeroEVTE}_${projeto.responsavel.nome.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Contrato baixado com sucesso",
      description: `O contrato para o projeto ${projeto.titulo} foi baixado.`,
    });
    
    if (action === "gerar" && projeto.status === "APROVADO") {
      navigate("/contratos");
    }
  };

  const isPreview = action === "preview";
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate("/contratos")}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isPreview ? "Visualizar Contrato" : "Gerar Contrato"}
          </h1>
          <p className="text-gray-500">
            {isPreview ? "Visualização do contrato gerado" : "Geração de contrato para o projeto"}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Detalhes do Projeto</h3>
                <div className="grid gap-2">
                  <div>
                    <span className="text-sm text-gray-500">Nome do Projeto:</span>
                    <p className="font-medium">{projeto.titulo}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Número EVTE:</span>
                    <p className="font-medium">EVTE-{projeto.numeroEVTE}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Responsável:</span>
                    <p className="font-medium">{projeto.responsavel.nome}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tipo de Rede:</span>
                    <p className="font-medium">
                      {projeto.tipoRede === "agua" ? "Água" : 
                       projeto.tipoRede === "esgoto" ? "Esgoto" : 
                       "Água e Esgoto"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <p className="font-medium">{projeto.status}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Cidade/Estado:</span>
                    <p className="font-medium">{projeto.cidade}, {projeto.estado}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Data de Início:</span>
                    <p className="font-medium">
                      {format(projeto.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={handleDownload}
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  {projeto.status === "APROVADO" ? "Baixar e Finalizar Contrato" : "Baixar Contrato"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Visualização do Contrato</h3>
                <FileTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono text-sm overflow-auto h-[600px] whitespace-pre-wrap">
                {contrato}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContratoForm;

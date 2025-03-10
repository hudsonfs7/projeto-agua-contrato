
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_PROJETOS } from "@/types";
import { Card } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";
import { generateContract } from "@/utils/contratoGenerator";

const ContratoForm = () => {
  const { id, action } = useParams();
  const navigate = useNavigate();
  const [contratoHtml, setContratoHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Encontrar o projeto pelo ID
  const projeto = MOCK_PROJETOS.find(p => p.id === id);
  
  useEffect(() => {
    const loadContrato = async () => {
      if (!projeto) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Simular um atraso para mostrar o efeito de carregamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar o contrato com base nos dados do projeto
        const html = generateContract({
          projeto,
          responsavel: { 
            nome: "Empresa XYZ", 
            cnpj: "12.345.678/0001-90",
            endereco: "Rua Exemplo, 123"
          }
        });
        
        setContratoHtml(html);
      } catch (error) {
        console.error("Erro ao gerar contrato:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContrato();
  }, [projeto]);
  
  if (!projeto) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <Card className="p-6">
            <h1 className="text-xl font-bold mb-4">Projeto não encontrado</h1>
            <p>Não foi possível encontrar o projeto solicitado.</p>
            <Button 
              onClick={() => navigate("/projetos")} 
              className="mt-4"
            >
              Voltar para Projetos
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  // Verificar se o projeto está em status aprovado
  const estaAprovado = projeto.status === "APROVADO";
  
  // Renderizar com base na ação solicitada (visualizar ou assinar)
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{action === "assinar" ? "Assinar Contrato" : "Visualizar Contrato"}</h1>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Projeto: {projeto.titulo}</span>
                <StatusBadge status={projeto.status} />
              </div>
            </div>
            
            <Button
              onClick={() => navigate("/contratos")}
              variant="outline"
            >
              Voltar
            </Button>
          </div>
          
          {isLoading ? (
            <Card className="p-10">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-agua-600 border-t-transparent rounded-full mb-4"></div>
                <p>Gerando contrato...</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="p-6 bg-white border-b border-gray-200">
                  <h2 className="text-lg font-medium">Contrato de Prestação de Serviços</h2>
                </div>
                
                <div className="p-6 bg-gray-50 max-h-[600px] overflow-y-auto">
                  <div 
                    dangerouslySetInnerHTML={{ __html: contratoHtml }} 
                    className="prose max-w-none"
                  />
                </div>
              </Card>
              
              {action === "assinar" && (
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4">Assinatura do Contrato</h3>
                  
                  {!estaAprovado ? (
                    <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
                      <p>Este projeto ainda não foi aprovado. A assinatura de contrato só é possível após a aprovação.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p>Confirme abaixo para assinar o contrato digitalmente.</p>
                      
                      <div className="flex gap-3">
                        <Button onClick={() => {
                          // Simular assinatura
                          setTimeout(() => {
                            toast.success("Contrato assinado com sucesso!");
                            navigate("/contratos");
                          }, 1500);
                        }}>
                          Assinar Contrato
                        </Button>
                        
                        <Button variant="outline" onClick={() => navigate("/contratos")}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContratoForm;

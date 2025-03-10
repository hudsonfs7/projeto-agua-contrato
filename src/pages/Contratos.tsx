
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileTextIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_PROJETOS } from "@/types";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filtrando apenas projetos com status APROVADO ou CONCLUIDO
  const projetosComContrato = MOCK_PROJETOS.filter(
    projeto => projeto.status === "APROVADO" || projeto.status === "CONCLUIDO"
  );
  
  const filteredContratos = projetosComContrato.filter(
    projeto => 
      projeto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projeto.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `EVTE-${projeto.numeroEVTE}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Contratos</h1>
          <p className="text-gray-500">
            Gerencie contratos para projetos aprovados
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button disabled>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Buscar contratos por projeto, cidade ou número EVTE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredContratos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileTextIcon className="h-16 w-16 text-gray-300 mb-4" />
            <CardDescription className="text-center max-w-md">
              {searchTerm ? (
                <>
                  Nenhum contrato encontrado para "{searchTerm}".
                  <br />
                  Tente uma nova busca ou crie um novo contrato.
                </>
              ) : (
                <>
                  Você ainda não possui contratos cadastrados.
                  <br />
                  Só é possível gerar contratos para projetos com status "Aprovado" ou "Concluído".
                </>
              )}
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredContratos.map((projeto) => (
            <Card key={projeto.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{projeto.titulo}</CardTitle>
                    <CardDescription>EVTE-{projeto.numeroEVTE}</CardDescription>
                  </div>
                  <Badge variant={projeto.status === "CONCLUIDO" ? "default" : "outline"}>
                    {projeto.status === "APROVADO" ? "Contrato Pendente" : "Contrato Assinado"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Responsável</div>
                    <div className="font-medium">{projeto.responsavel.nome}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Localização</div>
                    <div className="font-medium">{projeto.cidade}, {projeto.estado}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Data de Aprovação</div>
                    <div className="font-medium">
                      {format(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), "dd/MM/yyyy", { locale: ptBR })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button asChild variant="outline" className="mr-2">
                    <Link to={`/contratos/${projeto.id}/preview`}>Visualizar</Link>
                  </Button>
                  <Button asChild>
                    <Link to={`/contratos/${projeto.id}/gerar`}>
                      {projeto.status === "APROVADO" ? "Gerar Contrato" : "Baixar Contrato"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contratos;

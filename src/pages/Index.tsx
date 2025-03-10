import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, DropletIcon, FileTextIcon, UsersIcon } from "lucide-react";
import { MOCK_PROJETOS, MOCK_PESSOAS } from "@/types";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-24 pb-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Sistema de Gestão de Projetos de Saneamento</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie projetos de redes de água e esgoto para empreendimentos particulares de forma eficiente.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-agua-600 to-agua-400 text-white p-8 mb-12">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao AguaProj</h2>
            <p className="mb-6">
              Simplifique o gerenciamento dos seus projetos de saneamento, acompanhe o status de cada projeto, 
              cadastre pessoas e gere contratos automaticamente.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/projetos?showForm=true">Novo Projeto</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <Link to="/projetos">Ver Projetos</Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10">
            <DropletIcon className="w-64 h-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BarChart3Icon className="h-6 w-6 text-agua-600" />
              </div>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>
                Gerencie projetos de água e esgoto, acompanhe status e progresso.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/projetos">
                  Gerenciar Projetos ({MOCK_PROJETOS.length})
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Pessoas</CardTitle>
              <CardDescription>
                Cadastre e gerencie pessoas jurídicas e naturais.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/pessoas">
                  Gerenciar Pessoas ({MOCK_PESSOAS.length})
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FileTextIcon className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Contratos</CardTitle>
              <CardDescription>
                Gere contratos automaticamente a partir dos dados do projeto.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contratos">
                  Gerenciar Contratos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Recursos do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-agua-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-agua-600 font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">Cadastro de Pessoas</h3>
                <p className="text-gray-600 text-sm">
                  Cadastre pessoas jurídicas e naturais que serão responsáveis pelos projetos.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-agua-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-agua-600 font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">Gestão de Projetos</h3>
                <p className="text-gray-600 text-sm">
                  Controle seus projetos, inclua informações técnicas e acompanhe o status.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-agua-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-agua-600 font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">Atualização de Status</h3>
                <p className="text-gray-600 text-sm">
                  Atualize o status dos projetos à medida que avançam nas etapas.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-10 h-10 rounded-full bg-agua-100 flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-agua-600 font-medium">4</span>
              </div>
              <div>
                <h3 className="font-medium mb-1">Geração de Contratos</h3>
                <p className="text-gray-600 text-sm">
                  Gere automaticamente contratos baseados nas informações do projeto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

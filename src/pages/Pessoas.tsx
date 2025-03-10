
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pessoa, MOCK_PESSOAS } from "@/types";
import NavBar from "@/components/NavBar";
import { PlusIcon, Search, UserIcon, BuildingIcon } from "lucide-react";
import PessoaForm from "@/components/PessoaForm";
import { toast } from "sonner";

const Pessoas = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>(MOCK_PESSOAS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pessoaParaEditar, setPessoaParaEditar] = useState<Pessoa | undefined>(undefined);
  const [filtroTipo, setFiltroTipo] = useState<"todas" | "juridica" | "natural">("todas");

  const handleSavePessoa = (pessoa: Pessoa) => {
    if (pessoaParaEditar) {
      // Atualizar pessoa existente
      setPessoas(prevPessoas => 
        prevPessoas.map(p => (p.id === pessoa.id ? pessoa : p))
      );
      toast.success("Pessoa atualizada com sucesso!");
    } else {
      // Adicionar nova pessoa
      setPessoas(prevPessoas => [...prevPessoas, pessoa]);
      toast.success("Pessoa adicionada com sucesso!");
    }
    
    // Resetar o estado
    setShowForm(false);
    setPessoaParaEditar(undefined);
  };

  const handleEditPessoa = (pessoa: Pessoa) => {
    setPessoaParaEditar(pessoa);
    setShowForm(true);
  };

  // Filtragem de pessoas
  const pessoasFiltradas = pessoas.filter(pessoa => {
    const termMatch = pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       pessoa.documento.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filtroTipo === "todas") return termMatch;
    return termMatch && pessoa.tipo === filtroTipo;
  });

  const contagemJuridicas = pessoas.filter(p => p.tipo === "juridica").length;
  const contagemNaturais = pessoas.filter(p => p.tipo === "natural").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <div className="container mx-auto px-4 pt-24 pb-16 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pessoas</h1>
            <p className="text-gray-500">
              Gerencie pessoas jurídicas e naturais.
            </p>
          </div>
          
          <Button onClick={() => { setPessoaParaEditar(undefined); setShowForm(true); }}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nova Pessoa
          </Button>
        </div>

        {showForm ? (
          <div className="mb-10 animate-slide-in">
            <PessoaForm 
              onSave={handleSavePessoa} 
              pessoaInicial={pessoaParaEditar} 
            />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => { setShowForm(false); setPessoaParaEditar(undefined); }}
              >
                Cancelar e Voltar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total de Pessoas</CardTitle>
                  <CardDescription>Pessoas cadastradas no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pessoas.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pessoas Jurídicas</CardTitle>
                  <CardDescription>Empresas e organizações</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contagemJuridicas}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Pessoas Naturais</CardTitle>
                  <CardDescription>Pessoas físicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contagemNaturais}</div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Buscar por nome ou documento..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Tabs 
                    defaultValue="todas" 
                    value={filtroTipo}
                    onValueChange={(v) => setFiltroTipo(v as "todas" | "juridica" | "natural")}
                    className="w-full md:w-auto"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="todas">Todas</TabsTrigger>
                      <TabsTrigger value="juridica">Jurídicas</TabsTrigger>
                      <TabsTrigger value="natural">Naturais</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {pessoasFiltradas.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Nome / Razão Social</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Localização</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pessoasFiltradas.map((pessoa) => (
                        <TableRow key={pessoa.id}>
                          <TableCell>
                            <Badge variant="outline" className="flex gap-1 w-fit items-center">
                              {pessoa.tipo === "juridica" ? (
                                <>
                                  <BuildingIcon className="h-3 w-3" />
                                  <span>Jurídica</span>
                                </>
                              ) : (
                                <>
                                  <UserIcon className="h-3 w-3" />
                                  <span>Natural</span>
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{pessoa.nome}</TableCell>
                          <TableCell>{pessoa.documento}</TableCell>
                          <TableCell>
                            <div>{pessoa.email}</div>
                            <div className="text-sm text-gray-500">{pessoa.telefone}</div>
                          </TableCell>
                          <TableCell>
                            {pessoa.cidade}/{pessoa.estado}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditPessoa(pessoa)}
                            >
                              Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <UserIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma pessoa encontrada</h3>
                  <p className="mt-1 text-gray-500">
                    Não encontramos pessoas com os filtros informados.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pessoas;

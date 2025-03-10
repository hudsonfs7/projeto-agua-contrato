
import { useState } from "react";
import { Link } from "react-router-dom";
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pessoa, MOCK_PESSOAS, TipoPessoa } from "@/types";
import { UserIcon, BuildingIcon, PlusIcon, SearchIcon, PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PessoasList = () => {
  const [filtro, setFiltro] = useState("");
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa | "todos">("todos");
  
  // Formatar como CPF ou CNPJ para exibição
  const formatarDocumento = (documento: string, tipo: TipoPessoa) => {
    if (tipo === "juridica") {
      return documento; // Já formatado como CNPJ
    } else {
      return documento; // Já formatado como CPF
    }
  };

  const pessoasFiltradas = MOCK_PESSOAS.filter(pessoa => {
    const matchesFiltro = 
      pessoa.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      pessoa.documento.toLowerCase().includes(filtro.toLowerCase()) ||
      pessoa.email.toLowerCase().includes(filtro.toLowerCase()) ||
      pessoa.cidade.toLowerCase().includes(filtro.toLowerCase());
    
    const matchesTipo = tipoPessoa === "todos" || pessoa.tipo === tipoPessoa;
    
    return matchesFiltro && matchesTipo;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pessoas</h1>
          <p className="text-gray-500">
            Gerencie o cadastro de pessoas jurídicas e naturais
          </p>
        </div>
        <Button asChild>
          <Link to="/pessoas/novo" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Nova Pessoa
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Encontre pessoas específicas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por nome, documento ou cidade..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={tipoPessoa === "todos" ? "default" : "outline"} 
                onClick={() => setTipoPessoa("todos")}
              >
                Todos
              </Button>
              <Button 
                variant={tipoPessoa === "juridica" ? "default" : "outline"} 
                onClick={() => setTipoPessoa("juridica")}
                className="flex items-center gap-2"
              >
                <BuildingIcon className="h-4 w-4" />
                Jurídicas
              </Button>
              <Button 
                variant={tipoPessoa === "natural" ? "default" : "outline"} 
                onClick={() => setTipoPessoa("natural")}
                className="flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                Naturais
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Nome / Razão Social</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
                <TableHead className="hidden lg:table-cell">Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pessoasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhuma pessoa encontrada com os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                pessoasFiltradas.map((pessoa) => (
                  <TableRow key={pessoa.id}>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={pessoa.tipo === "juridica" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-green-50 text-green-600 border-green-200"}
                      >
                        {pessoa.tipo === "juridica" ? "Jurídica" : "Natural"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{pessoa.nome}</TableCell>
                    <TableCell>{formatarDocumento(pessoa.documento, pessoa.tipo)}</TableCell>
                    <TableCell className="hidden md:table-cell">{pessoa.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {pessoa.cidade && pessoa.estado 
                        ? `${pessoa.cidade}/${pessoa.estado}` 
                        : "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {format(new Date(pessoa.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/pessoas/${pessoa.id}`} className="flex items-center gap-1">
                          <PencilIcon className="h-3 w-3" />
                          Editar
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PessoasList;


import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MOCK_PESSOAS, Pessoa, TipoPessoa } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";

const PessoasForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  // Estado do formulário
  const [pessoa, setPessoa] = useState<Partial<Pessoa>>({
    tipo: "juridica" as TipoPessoa,
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    if (id) {
      const pessoaEncontrada = MOCK_PESSOAS.find(p => p.id === id);
      if (pessoaEncontrada) {
        setPessoa(pessoaEncontrada);
      } else {
        toast.error("Pessoa não encontrada");
        navigate("/pessoas");
      }
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPessoa(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoChange = (value: string) => {
    setPessoa(prev => ({
      ...prev,
      tipo: value as TipoPessoa
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pessoa.nome || !pessoa.documento || !pessoa.email) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Aqui seria feita a integração com uma API
    // Por enquanto, apenas simularemos o salvamento
    const novaPessoa: Pessoa = {
      ...pessoa as Pessoa,
      id: pessoa.id || uuidv4(),
      createdAt: pessoa.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (!isEdit) {
      // Adicionar à lista mock
      MOCK_PESSOAS.push(novaPessoa);
    } else {
      // Atualizar na lista mock
      const index = MOCK_PESSOAS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PESSOAS[index] = novaPessoa;
      }
    }

    toast.success(`Pessoa ${isEdit ? "atualizada" : "cadastrada"} com sucesso!`);
    navigate("/pessoas");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Editar Pessoa" : "Cadastrar Nova Pessoa"}
        </h1>
        <Button variant="outline" asChild>
          <Link to="/pessoas" className="flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Link>
        </Button>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{isEdit ? "Editar Pessoa" : "Nova Pessoa"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Pessoa */}
            <div className="space-y-2">
              <Label>Tipo de Pessoa</Label>
              <RadioGroup
                value={pessoa.tipo}
                onValueChange={handleTipoChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="natural" id="natural" />
                  <Label htmlFor="natural">Pessoa Natural</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Nome/Razão Social */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                {pessoa.tipo === "juridica" ? "Razão Social" : "Nome Completo"}*
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder={
                  pessoa.tipo === "juridica"
                    ? "Razão Social da empresa"
                    : "Nome completo da pessoa"
                }
                value={pessoa.nome || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Documento (CPF/CNPJ) */}
            <div className="space-y-2">
              <Label htmlFor="documento">
                {pessoa.tipo === "juridica" ? "CNPJ" : "CPF"}*
              </Label>
              <Input
                id="documento"
                name="documento"
                placeholder={
                  pessoa.tipo === "juridica" ? "00.000.000/0000-00" : "000.000.000-00"
                }
                value={pessoa.documento || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={pessoa.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={pessoa.telefone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Rua, número, complemento"
                value={pessoa.endereco || ""}
                onChange={handleChange}
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  placeholder="Cidade"
                  value={pessoa.cidade || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  placeholder="UF"
                  maxLength={2}
                  value={pessoa.estado || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 border-t p-6">
            <Button variant="outline" type="button" onClick={() => navigate('/pessoas')}>
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <SaveIcon className="h-4 w-4" />
              Salvar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default PessoasForm;

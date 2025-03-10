
import { useState } from "react";
import { Pessoa, TipoPessoa } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface PessoaFormProps {
  onSave: (pessoa: Pessoa) => void;
  pessoaInicial?: Pessoa;
}

const PessoaForm = ({ onSave, pessoaInicial }: PessoaFormProps) => {
  const [pessoa, setPessoa] = useState<Partial<Pessoa>>(
    pessoaInicial || {
      tipo: "juridica" as TipoPessoa,
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      endereco: "",
      cidade: "",
      estado: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPessoa((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!pessoa.nome || !pessoa.documento || !pessoa.email) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    const novaPessoa: Pessoa = {
      ...(pessoa as Pessoa),
      id: pessoa.id || uuidv4(),
      createdAt: pessoa.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(novaPessoa);
    toast.success("Pessoa salva com sucesso!");
    
    // Resetar o formulário se for uma nova pessoa
    if (!pessoaInicial) {
      setPessoa({
        tipo: "juridica",
        nome: "",
        documento: "",
        email: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{pessoaInicial ? "Editar Pessoa" : "Nova Pessoa"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Pessoa</Label>
            <RadioGroup
              value={pessoa.tipo}
              onValueChange={(value) =>
                setPessoa((prev) => ({ ...prev, tipo: value as TipoPessoa }))
              }
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
          <Button variant="outline" type="button" onClick={() => history.back()}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PessoaForm;


import { useState, useEffect } from "react";
import { Projeto, TipoRede, StatusProjeto, Pessoa, FAIXAS_RENDA, STATUS_PROJETO_MAP } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface ProjetoFormProps {
  onSave: (projeto: Projeto) => void;
  projetoInicial?: Projeto;
  pessoas: Pessoa[];
}

const ProjetoForm = ({ onSave, projetoInicial, pessoas }: ProjetoFormProps) => {
  const [projeto, setProjeto] = useState<Partial<Projeto>>(
    projetoInicial || {
      tipoRede: "agua" as TipoRede,
      numeroEVTE: "",
      titulo: "",
      descricao: "",
      responsavelId: "",
      cidade: "",
      estado: "",
      bairro: "",
      numeroLotesHabitacionais: 0,
      numeroLotesComerciais: 0,
      faixaRendaId: 1,
      status: "analise_inicial" as StatusProjeto,
      dataInicio: new Date(),
      previsaoConclusao: null,
      dataConclusao: null,
      observacoes: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjeto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjeto((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProjeto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setProjeto((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!projeto.titulo || !projeto.numeroEVTE || !projeto.responsavelId) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    const novoProjeto: Projeto = {
      ...(projeto as Projeto),
      id: projeto.id || uuidv4(),
      createdAt: projeto.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(novoProjeto);
    toast.success("Projeto salvo com sucesso!");
    
    // Resetar o formulário se for um novo projeto
    if (!projetoInicial) {
      setProjeto({
        tipoRede: "agua" as TipoRede,
        numeroEVTE: "",
        titulo: "",
        descricao: "",
        responsavelId: "",
        cidade: "",
        estado: "",
        bairro: "",
        numeroLotesHabitacionais: 0,
        numeroLotesComerciais: 0,
        faixaRendaId: 1,
        status: "analise_inicial" as StatusProjeto,
        dataInicio: new Date(),
        previsaoConclusao: null,
        dataConclusao: null,
        observacoes: "",
      });
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>{projetoInicial ? "Editar Projeto" : "Novo Projeto"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Projeto*</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Nome do empreendimento"
                value={projeto.titulo || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroEVTE">Número EVTE*</Label>
              <Input
                id="numeroEVTE"
                name="numeroEVTE"
                placeholder="Número do EVTE"
                value={projeto.numeroEVTE || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tipoRede">Tipo de Rede*</Label>
              <Select
                value={projeto.tipoRede}
                onValueChange={(value) => handleSelectChange("tipoRede", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de rede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agua">Água</SelectItem>
                  <SelectItem value="esgoto">Esgoto</SelectItem>
                  <SelectItem value="agua_esgoto">Água e Esgoto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsavelId">Responsável*</Label>
              <Select
                value={projeto.responsavelId}
                onValueChange={(value) => handleSelectChange("responsavelId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {pessoas.map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descrição detalhada do projeto"
              value={projeto.descricao || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade*</Label>
              <Input
                id="cidade"
                name="cidade"
                placeholder="Cidade"
                value={projeto.cidade || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estado">Estado*</Label>
              <Input
                id="estado"
                name="estado"
                placeholder="UF"
                maxLength={2}
                value={projeto.estado || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                name="bairro"
                placeholder="Bairro"
                value={projeto.bairro || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroLotesHabitacionais">Lotes Habitacionais</Label>
              <Input
                id="numeroLotesHabitacionais"
                name="numeroLotesHabitacionais"
                type="number"
                min="0"
                value={projeto.numeroLotesHabitacionais || ""}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numeroLotesComerciais">Lotes Comerciais</Label>
              <Input
                id="numeroLotesComerciais"
                name="numeroLotesComerciais"
                type="number"
                min="0"
                value={projeto.numeroLotesComerciais || ""}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="faixaRendaId">Faixa de Renda</Label>
              <Select
                value={projeto.faixaRendaId?.toString()}
                onValueChange={(value) => handleSelectChange("faixaRendaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa de renda" />
                </SelectTrigger>
                <SelectContent>
                  {FAIXAS_RENDA.map((faixa) => (
                    <SelectItem key={faixa.id} value={faixa.id.toString()}>
                      {faixa.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={projeto.status}
                onValueChange={(value) => handleSelectChange("status", value as StatusProjeto)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_PROJETO_MAP).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !projeto.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projeto.dataInicio ? (
                      format(projeto.dataInicio, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={projeto.dataInicio}
                    onSelect={(date) => handleDateChange("dataInicio", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Previsão de Conclusão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !projeto.previsaoConclusao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {projeto.previsaoConclusao ? (
                      format(projeto.previsaoConclusao, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto">
                  <Calendar
                    mode="single"
                    selected={projeto.previsaoConclusao || undefined}
                    onSelect={(date) => handleDateChange("previsaoConclusao", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais sobre o projeto"
              value={projeto.observacoes || ""}
              onChange={handleChange}
              rows={3}
            />
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

export default ProjetoForm;

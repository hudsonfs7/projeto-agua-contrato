
import { useState, useEffect } from "react";
import { Projeto, TipoRede, StatusProjeto, Pessoa, FAIXAS_RENDA, STATUS_PROJETO_MAP, ServicoAdicional } from "@/types";
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
import { CalendarIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjetoFormProps {
  onSave: (projeto: Projeto) => void;
  projetoInicial?: Projeto;
  pessoas: Pessoa[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

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
      valorProjetoAgua: 0,
      valorProjetoEsgoto: 0,
      servicosAdicionais: [],
      dataInicio: new Date(),
      previsaoConclusao: null,
      dataConclusao: null,
      observacoes: "",
    }
  );

  const [novoServico, setNovoServico] = useState<Partial<ServicoAdicional>>({
    descricao: "",
    valor: 0
  });

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

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
    setProjeto((prev) => ({
      ...prev,
      [name]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleServicoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "valor") {
      const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
      setNovoServico(prev => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue
      }));
    } else {
      setNovoServico(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const adicionarServico = () => {
    if (!novoServico.descricao) {
      toast.error("Preencha a descrição do serviço");
      return;
    }

    const novoServicoCompleto: ServicoAdicional = {
      id: uuidv4(),
      descricao: novoServico.descricao || "",
      valor: novoServico.valor || 0
    };

    setProjeto(prev => ({
      ...prev,
      servicosAdicionais: [...(prev.servicosAdicionais || []), novoServicoCompleto]
    }));

    setNovoServico({
      descricao: "",
      valor: 0
    });

    toast.success("Serviço adicionado");
  };

  const removerServico = (id: string) => {
    setProjeto(prev => ({
      ...prev,
      servicosAdicionais: (prev.servicosAdicionais || []).filter(s => s.id !== id)
    }));
    toast.success("Serviço removido");
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

  const calcularValorTotal = (): number => {
    const valorAgua = projeto.valorProjetoAgua || 0;
    const valorEsgoto = projeto.valorProjetoEsgoto || 0;
    const valorServicos = (projeto.servicosAdicionais || []).reduce(
      (soma, servico) => soma + servico.valor, 0
    );
    
    return valorAgua + valorEsgoto + valorServicos;
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
      valorProjetoAgua: projeto.valorProjetoAgua || 0,
      valorProjetoEsgoto: projeto.valorProjetoEsgoto || 0,
      servicosAdicionais: projeto.servicosAdicionais || [],
      createdAt: projeto.createdAt || new Date(),
      updatedAt: new Date(),
    };
    
    onSave(novoProjeto);
    
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
        valorProjetoAgua: 0,
        valorProjetoEsgoto: 0,
        servicosAdicionais: [],
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
          {/* Informações básicas */}
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
          
          {/* Localização */}
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
          
          {/* Detalhes dos lotes */}
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
          
          {/* Status e datas */}
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
          
          {/* Seção de Valores */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Valores do Projeto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="valorProjetoAgua">Valor do Projeto de Água</Label>
                <Input
                  id="valorProjetoAgua"
                  name="valorProjetoAgua"
                  placeholder="R$ 0,00"
                  value={formatCurrency(projeto.valorProjetoAgua || 0)}
                  onChange={handleCurrencyChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorProjetoEsgoto">Valor do Projeto de Esgoto</Label>
                <Input
                  id="valorProjetoEsgoto"
                  name="valorProjetoEsgoto"
                  placeholder="R$ 0,00"
                  value={formatCurrency(projeto.valorProjetoEsgoto || 0)}
                  onChange={handleCurrencyChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium mb-3">Serviços Adicionais</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Input
                    name="descricao"
                    placeholder="Descrição do serviço"
                    value={novoServico.descricao}
                    onChange={handleServicoChange}
                  />
                </div>
                <div className="flex space-x-2">
                  <Input
                    name="valor"
                    placeholder="R$ 0,00"
                    value={formatCurrency(novoServico.valor || 0)}
                    onChange={handleServicoChange}
                  />
                  <Button 
                    type="button" 
                    onClick={adicionarServico}
                    className="flex-shrink-0"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {(projeto.servicosAdicionais || []).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80%]">Descrição</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(projeto.servicosAdicionais || []).map((servico) => (
                      <TableRow key={servico.id}>
                        <TableCell>{servico.descricao}</TableCell>
                        <TableCell className="text-right">{formatCurrency(servico.valor)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removerServico(servico.id)}
                          >
                            <Trash2Icon className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
                  Nenhum serviço adicional cadastrado
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Valor Total do Projeto:</span>
                <span className="text-xl font-bold">{formatCurrency(calcularValorTotal())}</span>
              </div>
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

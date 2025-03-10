
import { Pessoa, Projeto, FAIXAS_RENDA } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const gerarContrato = (projeto: Projeto, responsavel: Pessoa) => {
  // Obter a faixa de renda
  const faixaRenda = FAIXAS_RENDA.find(f => f.id === projeto.faixaRendaId);
  
  // Texto do contrato
  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  // Determinar o tipo de contrato
  const tipoRede = projeto.tipoRede === 'agua' 
    ? 'REDE DE ABASTECIMENTO DE ÁGUA' 
    : projeto.tipoRede === 'esgoto' 
      ? 'REDE DE ESGOTAMENTO SANITÁRIO'
      : 'REDES DE ABASTECIMENTO DE ÁGUA E ESGOTAMENTO SANITÁRIO';
  
  // Construir o conteúdo do contrato
  const contrato = `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ENGENHARIA PARA ELABORAÇÃO DE PROJETO DE ${tipoRede.toUpperCase()}

CONTRATO Nº ${projeto.numeroEVTE}/${new Date().getFullYear()}

CONTRATANTE: ${responsavel.nome}, ${responsavel.tipo === 'juridica' ? 'pessoa jurídica de direito privado, inscrita no CNPJ sob nº' : 'pessoa natural, inscrita no CPF sob nº'} ${responsavel.documento}, com sede/residente em ${responsavel.endereco}, ${responsavel.cidade}/${responsavel.estado}, neste ato representada por seu representante legal.

CONTRATADA: COMPANHIA DE SANEAMENTO BÁSICO, pessoa jurídica de direito público, inscrita no CNPJ sob nº 00.000.000/0001-00, com sede na Avenida Principal, nº 1000, Centro, Capital/UF, neste ato representada pelo Diretor de Projetos.

As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços de Engenharia para Elaboração de Projeto de ${tipoRede}, que se regerá pelas cláusulas seguintes e pelas condições descritas no presente.

CLÁUSULA PRIMEIRA - DO OBJETO

O presente contrato tem como objeto a prestação de serviços de engenharia para elaboração de projeto de ${tipoRede.toLowerCase()} para o empreendimento denominado "${projeto.titulo}", localizado em ${projeto.bairro}, ${projeto.cidade}/${projeto.estado}.

Parágrafo Único: O empreendimento possui ${projeto.numeroLotesHabitacionais} lotes habitacionais e ${projeto.numeroLotesComerciais} lotes comerciais, com faixa de renda classificada como: ${faixaRenda?.descricao}.

CLÁUSULA SEGUNDA - DO ESCOPO DOS SERVIÇOS

A CONTRATADA se compromete a elaborar o projeto completo de ${tipoRede.toLowerCase()}, incluindo:
1. Estudos preliminares de viabilidade técnica;
2. Projeto básico;
3. Projeto executivo;
4. Memorial descritivo;
5. Memorial de cálculo;
6. Especificações técnicas;
7. Planilha orçamentária;
8. Cronograma físico-financeiro;
9. Anotação de Responsabilidade Técnica (ART).

CLÁUSULA TERCEIRA - DO PRAZO DE EXECUÇÃO

Os serviços serão iniciados em ${format(projeto.dataInicio, "dd/MM/yyyy")}, com previsão de conclusão para ${projeto.previsaoConclusao ? format(projeto.previsaoConclusao, "dd/MM/yyyy") : 'data a ser definida'}.

CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATANTE

São obrigações da CONTRATANTE:
1. Fornecer todas as informações necessárias à execução dos serviços;
2. Permitir acesso dos técnicos da CONTRATADA ao local do empreendimento;
3. Aprovar os projetos e documentos técnicos desenvolvidos;
4. Efetuar os pagamentos nos prazos estabelecidos.

CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATADA

São obrigações da CONTRATADA:
1. Executar os serviços conforme as normas técnicas vigentes;
2. Manter sigilo sobre as informações recebidas da CONTRATANTE;
3. Prestar esclarecimentos à CONTRATANTE sobre o projeto;
4. Realizar as correções solicitadas pela CONTRATANTE.

CLÁUSULA SEXTA - DISPOSIÇÕES GERAIS

O presente contrato é firmado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

E, por estarem assim justos e contratados, firmam o presente instrumento, em duas vias de igual teor, juntamente com 2 (duas) testemunhas.

${projeto.cidade}, ${dataAtual}


_________________________________
${responsavel.nome}
CONTRATANTE


_________________________________
COMPANHIA DE SANEAMENTO BÁSICO
CONTRATADA


TESTEMUNHAS:

1. _______________________    2. _______________________
Nome:                          Nome:
CPF:                           CPF:
`;

  return contrato;
};

export default gerarContrato;


import { Projeto } from "@/types";
import StatusBadge from "./StatusBadge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropletIcon, DropletIcon as WaterDropIcon, PercentIcon, BarChart2Icon, CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

interface ProjetoCardProps {
  projeto: Projeto;
}

const ProjetoCard = ({ projeto }: ProjetoCardProps) => {
  const getTipoRedeIcon = () => {
    switch (projeto.tipoRede) {
      case 'agua':
        return <DropletIcon className="w-4 h-4 text-agua-600" />;
      case 'esgoto':
        return <WaterDropIcon className="w-4 h-4 text-gray-600" />;
      case 'agua_esgoto':
        return (
          <div className="flex space-x-1">
            <DropletIcon className="w-4 h-4 text-agua-600" />
            <WaterDropIcon className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  const getTipoRedeText = () => {
    switch (projeto.tipoRede) {
      case 'agua':
        return 'Água';
      case 'esgoto':
        return 'Esgoto';
      case 'agua_esgoto':
        return 'Água e Esgoto';
    }
  };

  return (
    <Link to={`/projetos/${projeto.id}`}>
      <Card className="overflow-hidden hover-lift card-transition border-gray-200 h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{projeto.titulo}</CardTitle>
            <StatusBadge status={projeto.status} />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
              {projeto.cidade}, {projeto.estado}
            </div>
            
            <div className="flex space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1 bg-white">
                {getTipoRedeIcon()}
                <span>{getTipoRedeText()}</span>
              </Badge>
              
              <Badge variant="outline" className="flex items-center space-x-1 bg-white">
                <BarChart2Icon className="w-3 h-3" />
                <span>EVTE-{projeto.numeroEVTE}</span>
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Lotes Residenciais</span>
                <span className="font-medium">{projeto.numeroLotesHabitacionais}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500">Lotes Comerciais</span>
                <span className="font-medium">{projeto.numeroLotesComerciais}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500 border-t">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            Início: {format(projeto.dataInicio, "dd/MM/yyyy", { locale: ptBR })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjetoCard;

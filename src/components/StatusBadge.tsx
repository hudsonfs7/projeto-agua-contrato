
import { StatusProjeto, STATUS_PROJETO_MAP } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: StatusProjeto;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusInfo = STATUS_PROJETO_MAP[status];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", 
        statusInfo.color,
        className
      )}
    >
      {statusInfo.label}
    </span>
  );
};

export default StatusBadge;

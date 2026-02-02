import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle, ArrowUpRight, TrendingUp, Hash } from 'lucide-react';
import { type Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  onClick: () => void;
}

const priorityConfig = {
  high: { 
    badgeClass: 'badge-priority-high',
    icon: AlertCircle,
    label: 'HIGH',
  },
  medium: { 
    badgeClass: 'badge-priority-medium',
    icon: TrendingUp,
    label: 'MED',
  },
  low: { 
    badgeClass: 'badge-priority-low',
    icon: ArrowUpRight,
    label: 'LOW',
  },
};

const tagColors = [
  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'bg-amber-500/10 text-amber-400 border-amber-500/20',
];

function getTagColor(index: number): string {
  return tagColors[index % tagColors.length];
}

export function TicketCard({ ticket, index, onClick }: TicketCardProps) {
  const priority = priorityConfig[ticket.priority];
  const PriorityIcon = priority.icon;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`ticket-card priority-${ticket.priority} ${
            snapshot.isDragging ? 'dragging' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Top Row: Priority Badge & Actions */}
          <div className="flex items-start justify-between mb-3">
            <span className={priority.badgeClass}>
              <PriorityIcon className="w-3 h-3" />
              {priority.label}
            </span>
            {ticket.value && (
              <span className="font-mono text-xs text-trade-300">
                ${ticket.value.toLocaleString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-medium text-white mb-2 line-clamp-2 text-sm leading-relaxed">
            {ticket.title}
          </h4>

          {/* Description preview */}
          {ticket.description && (
            <p className="text-xs text-trade-400 mb-3 line-clamp-2 leading-relaxed">
              {ticket.description}
            </p>
          )}

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {ticket.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${getTagColor(i)}`}
                >
                  <Hash className="w-3 h-3 opacity-50" />
                  {tag}
                </span>
              ))}
              {ticket.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-trade-500 bg-trade-600/30">
                  +{ticket.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-trade-600/30">
            {/* Assignee */}
            <div className="flex items-center gap-2">
              <div className="avatar w-5 h-5 text-[10px]">
                {ticket.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-trade-400">{ticket.assignee}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 text-xs text-trade-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-accent-blue/0 group-hover:ring-accent-blue/20 transition-all duration-200 pointer-events-none" />
        </div>
      )}
    </Draggable>
  );
}

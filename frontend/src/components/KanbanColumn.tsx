import { Droppable } from '@hello-pangea/dnd';
import { type Ticket, type TicketStatus } from '../types/ticket';
import { TicketCard } from './TicketCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  onAddTicket: (status: TicketStatus) => void;
  index: number;
}

const columnConfig: Record<TicketStatus, { 
  color: string; 
  bgColor: string;
  dotClass: string;
  label: string;
}> = {
  todo: {
    color: 'text-column-todo',
    bgColor: 'bg-column-todo/10',
    dotClass: 'status-dot-todo',
    label: 'To Do',
  },
  inprogress: {
    color: 'text-column-inprogress',
    bgColor: 'bg-column-inprogress/10',
    dotClass: 'status-dot-inprogress',
    label: 'In Progress',
  },
  hold: {
    color: 'text-column-hold',
    bgColor: 'bg-column-hold/10',
    dotClass: 'status-dot-hold',
    label: 'On Hold',
  },
  done: {
    color: 'text-column-done',
    bgColor: 'bg-column-done/10',
    dotClass: 'status-dot-done',
    label: 'Done',
  },
};

const columnClasses: Record<TicketStatus, string> = {
  todo: 'column-todo',
  inprogress: 'column-inprogress',
  hold: 'column-hold',
  done: 'column-done',
};

export function KanbanColumn({ id, title, tickets, onTicketClick, onAddTicket, index }: KanbanColumnProps) {
  const config = columnConfig[id];
  const totalValue = tickets.reduce((sum, t) => sum + (t.value || 0), 0);

  return (
    <div className={`kanban-column ${columnClasses[id]} animate-fade-in animate-delay-${(index + 1) * 100}`}>
      {/* Column Header */}
      <div className="kanban-column-header">
        <div className="kanban-column-title">
          <div className={`w-2 h-2 rounded-full ${config.dotClass}`} />
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="count-badge">{tickets.length}</span>
        </div>
        <button
          onClick={() => onAddTicket(id)}
          className="p-1.5 rounded-lg bg-trade-600/30 text-trade-400 hover:bg-trade-500 hover:text-white transition-all duration-200"
          title="Add new ticket"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Stats (if has value data) */}
      {totalValue > 0 && (
        <div className="px-4 py-2 bg-trade-900/30 border-b border-trade-600/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-trade-400">Total Value</span>
            <span className={`font-mono font-medium ${config.color}`}>
              ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-column-content ${
              snapshot.isDraggingOver ? 'drag-over' : ''
            }`}
          >
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center mb-3`}>
                  <Plus className={`w-6 h-6 ${config.color} opacity-50`} />
                </div>
                <p className="text-sm text-trade-500">No trades yet</p>
                <button
                  onClick={() => onAddTicket(id)}
                  className="mt-2 text-xs text-trade-400 hover:text-white transition-colors"
                >
                  Add one
                </button>
              </div>
            ) : (
              tickets.map((ticket, ticketIndex) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  index={ticketIndex}
                  onClick={() => onTicketClick(ticket)}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

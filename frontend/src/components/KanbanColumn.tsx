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
}

const columnColors: Record<TicketStatus, string> = {
  todo: 'border-t-4 border-gray-400',
  inprogress: 'border-t-4 border-blue-500',
  hold: 'border-t-4 border-yellow-500',
  done: 'border-t-4 border-green-500',
};

export function KanbanColumn({ id, title, tickets, onTicketClick, onAddTicket }: KanbanColumnProps) {
  return (
    <div className={`kanban-column ${columnColors[id]}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {tickets.length}
          </span>
        </div>
        <button
          onClick={() => onAddTicket(id)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto min-h-[100px] rounded-lg transition-colors ${
              snapshot.isDraggingOver ? 'bg-gray-200/50 dark:bg-gray-700/50' : ''
            }`}
          >
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                index={index}
                onClick={() => onTicketClick(ticket)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

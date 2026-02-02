import { Draggable } from '@hello-pangea/dnd';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { type Ticket } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  onClick: () => void;
}

const priorityConfig = {
  high: { color: 'text-red-500 bg-red-50 dark:bg-red-900/20', icon: AlertCircle },
  medium: { color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20', icon: AlertCircle },
  low: { color: 'text-green-500 bg-green-50 dark:bg-green-900/20', icon: AlertCircle },
};

export function TicketCard({ ticket, index, onClick }: TicketCardProps) {
  const priority = priorityConfig[ticket.priority];

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`ticket-card priority-${ticket.priority} mb-3 ${
            snapshot.isDragging ? 'dragging' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${priority.color}`}>
              {ticket.priority.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
            {ticket.title}
          </h4>

          {/* Description preview */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {ticket.description}
          </p>

          {/* Tags */}
          {ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {ticket.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  #{tag}
                </span>
              ))}
              {ticket.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{ticket.tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{ticket.assignee}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

import { useState, useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { Search, Plus, Filter } from 'lucide-react';
import { type Ticket, type TicketStatus, type TicketPriority, COLUMNS } from '../types/ticket';
import { initialTickets } from '../data/initialData';
import { KanbanColumn } from './KanbanColumn';
import { TicketModal } from './TicketModal';

export function KanbanBoard() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicketStatus, setNewTicketStatus] = useState<TicketStatus | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
      
      return matchesSearch && matchesPriority;
    });
  }, [tickets, searchQuery, filterPriority]);

  // Group tickets by status
  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      tickets: filteredTickets.filter((t) => t.status === col.id),
    }));
  }, [filteredTickets]);

  // Handle drag end
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    setTickets((prev) => {
      const ticket = prev.find((t) => t.id === draggableId);
      if (!ticket) return prev;

      const newStatus = destination.droppableId as TicketStatus;
      const updatedTicket = { ...ticket, status: newStatus, updatedAt: new Date().toISOString() };

      // Remove from old position and insert at new position
      const newTickets = prev.filter((t) => t.id !== draggableId);
      
      // Find insertion index in destination column
      const destTickets = newTickets.filter((t) => t.status === newStatus);
      const insertIndex = newTickets.findIndex((t) => t.status === newStatus && destTickets.indexOf(t) === destination.index);
      
      if (insertIndex === -1) {
        newTickets.push(updatedTicket);
      } else {
        newTickets.splice(insertIndex, 0, updatedTicket);
      }

      return newTickets;
    });
  };

  const handleAddTicket = (status: TicketStatus) => {
    setNewTicketStatus(status);
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setNewTicketStatus(null);
    setIsModalOpen(true);
  };

  const handleSaveTicket = (ticketData: Partial<Ticket>) => {
    if (selectedTicket) {
      // Edit existing
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, ...ticketData, updatedAt: new Date().toISOString() }
            : t
        )
      );
    } else {
      // Create new
      const newTicket: Ticket = {
        id: Date.now().toString(),
        title: ticketData.title || 'New Ticket',
        description: ticketData.description || '',
        status: newTicketStatus || 'todo',
        priority: (ticketData.priority as TicketPriority) || 'medium',
        tags: ticketData.tags || [],
        assignee: ticketData.assignee || 'Jacob',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTickets((prev) => [...prev, newTicket]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trading Board</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your trading tasks and positions</p>
          </div>
          <button
            onClick={() => handleAddTicket('todo')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:outline-none focus:border-blue-500 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tickets={column.tickets}
                onTicketClick={handleEditTicket}
                onAddTicket={handleAddTicket}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <TicketModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveTicket}
          onDelete={selectedTicket ? () => handleDeleteTicket(selectedTicket.id) : undefined}
        />
      )}
    </div>
  );
}

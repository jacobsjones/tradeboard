import { useState, useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { Search, Plus, Filter, Layout, Bell, Settings } from 'lucide-react';
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

  const totalTickets = tickets.length;
  const highPriorityCount = tickets.filter(t => t.priority === 'high').length;
  const inProgressCount = tickets.filter(t => t.status === 'inprogress').length;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="app-header">
        {/* Top Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-glow-blue">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Task<span className="text-gradient">Board</span>
                  </h1>
                  <p className="text-xs text-trade-400">Task Management</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-lg bg-trade-700/50 border border-trade-600/50 text-trade-400 hover:text-white hover:bg-trade-600 transition-all duration-200">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-lg bg-trade-700/50 border border-trade-600/50 text-trade-400 hover:text-white hover:bg-trade-600 transition-all duration-200">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleAddTicket('todo')}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Filter Bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{totalTickets}</span>
                <span className="text-sm text-trade-400">Total</span>
              </div>
              <div className="w-px h-8 bg-trade-600/50" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-priority-high">{highPriorityCount}</span>
                <span className="text-sm text-trade-400">High Priority</span>
              </div>
              <div className="w-px h-8 bg-trade-600/50" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-column-inprogress">{inProgressCount}</span>
                <span className="text-sm text-trade-400">In Progress</span>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400" />
                <input
                  type="text"
                  placeholder="Search tasks, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-trade-400" />
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="form-input pl-9 pr-8 py-2 appearance-none cursor-pointer"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 h-full min-w-max">
            {columns.map((column, index) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                tickets={column.tickets}
                onTicketClick={handleEditTicket}
                onAddTicket={handleAddTicket}
                index={index}
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

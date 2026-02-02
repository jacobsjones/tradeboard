export type TicketStatus = 'todo' | 'inprogress' | 'hold' | 'done';
export type TicketPriority = 'high' | 'medium' | 'low';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  tags: string[];
  assignee: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

export const COLUMNS: { id: TicketStatus; title: string }[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'hold', title: 'Hold' },
  { id: 'done', title: 'Done' },
];

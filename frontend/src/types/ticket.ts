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
  value?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
}

export const COLUMNS: { id: TicketStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'hold', title: 'On Hold' },
  { id: 'done', title: 'Completed' },
];

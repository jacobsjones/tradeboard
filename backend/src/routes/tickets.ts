import { Router } from 'express';
import { db, Ticket } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/tickets - List all tickets
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM tickets ORDER BY updated_at DESC';
    const params: any[] = [];

    if (status) {
      sql = 'SELECT * FROM tickets WHERE status = ? ORDER BY updated_at DESC';
      params.push(status);
    }

    const tickets = await db.all<Ticket>(sql, params);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET /api/tickets/:id - Get single ticket
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// POST /api/tickets - Create new ticket
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, tags, assignee } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const sql = `
      INSERT INTO tickets (title, description, status, priority, tags, assignee)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(sql, [
      title,
      description || '',
      status || 'todo',
      priority || 'medium',
      tags || '',
      assignee || 'Jacob',
    ]);

    const newTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [result.lastID]);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// PUT /api/tickets/:id - Update ticket
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, tags, assignee } = req.body;

    const existingTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);
    if (!existingTicket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    const sql = `
      UPDATE tickets 
      SET title = ?, description = ?, status = ?, priority = ?, tags = ?, assignee = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.run(sql, [
      title || existingTicket.title,
      description !== undefined ? description : existingTicket.description,
      status || existingTicket.status,
      priority || existingTicket.priority,
      tags !== undefined ? tags : existingTicket.tags,
      assignee || existingTicket.assignee,
      id,
    ]);

    const updatedTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// PATCH /api/tickets/:id/status - Update only status (for drag-drop)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['todo', 'inprogress', 'hold', 'done'].includes(status)) {
      res.status(400).json({ error: 'Valid status is required' });
      return;
    }

    const existingTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);
    if (!existingTicket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    await db.run(
      'UPDATE tickets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    const updatedTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);
    res.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// DELETE /api/tickets/:id - Delete ticket
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingTicket = await db.get<Ticket>('SELECT * FROM tickets WHERE id = ?', [id]);
    if (!existingTicket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    await db.run('DELETE FROM tickets WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

export default router;

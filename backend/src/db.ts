import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const DB_PATH = path.join(__dirname, '../database.sqlite');

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'hold' | 'done';
  priority: 'high' | 'medium' | 'low';
  tags: string;
  assignee: string;
  created_at: string;
  updated_at: string;
}

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initialize();
      }
    });
  }

  private initialize(): void {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT CHECK(status IN ('todo', 'inprogress', 'hold', 'done')) DEFAULT 'todo',
        priority TEXT CHECK(priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
        tags TEXT DEFAULT '',
        assignee TEXT DEFAULT 'Jacob',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableSql, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Tickets table ready');
        this.seedData();
      }
    });
  }

  private seedData(): void {
    const countSql = 'SELECT COUNT(*) as count FROM tickets';
    
    this.db.get(countSql, (err, row: { count: number }) => {
      if (err) {
        console.error('Error counting tickets:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Seeding initial data...');
        const seedTickets = [
          {
            title: 'Set up YCA position alerts',
            description: 'Configure price alerts for YCA positions at key support/resistance levels',
            status: 'todo',
            priority: 'high',
            tags: 'yca,alerts,position',
            assignee: 'Jacob',
          },
          {
            title: 'Research Thales options expiry',
            description: 'Analyze upcoming Thales options expiry dates and prepare rollover strategy',
            status: 'todo',
            priority: 'medium',
            tags: 'thales,options,research',
            assignee: 'Jacob',
          },
          {
            title: 'Monitor gold price resistance at $2,800',
            description: 'Watch XAU/USD for breakout above $2,800 resistance. Set alerts for volume spikes.',
            status: 'inprogress',
            priority: 'high',
            tags: 'gold,technical,xauusd',
            assignee: 'Jacob',
          },
          {
            title: 'EUR/USD technical analysis',
            description: 'Complete weekly TA on EUR/USD. Check RSI, MACD, and support levels.',
            status: 'inprogress',
            priority: 'medium',
            tags: 'eurusd,forex,technical',
            assignee: 'Jacob',
          },
          {
            title: 'Awaiting FOMC announcement for USD positions',
            description: 'Hold USD positions until Fed announcement. Review dot plot projections.',
            status: 'hold',
            priority: 'high',
            tags: 'forex,fomc,fed,usd',
            assignee: 'Jacob',
          },
          {
            title: 'Closed Q4 P&L review',
            description: 'Finalized quarterly profit/loss analysis and tax preparation documents.',
            status: 'done',
            priority: 'low',
            tags: 'review,pnl,quarterly,tax',
            assignee: 'Jacob',
          },
          {
            title: 'Updated risk management rules',
            description: 'Revised max position sizing and stop-loss rules for 2025 trading.',
            status: 'done',
            priority: 'medium',
            tags: 'risk,rules,management',
            assignee: 'Jacob',
          },
        ];

        const insertSql = `
          INSERT INTO tickets (title, description, status, priority, tags, assignee)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        const stmt = this.db.prepare(insertSql);
        seedTickets.forEach((ticket) => {
          stmt.run(
            ticket.title,
            ticket.description,
            ticket.status,
            ticket.priority,
            ticket.tags,
            ticket.assignee
          );
        });
        stmt.finalize();
        console.log('Seed data inserted');
      }
    });
  }

  public run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  public get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row as T);
        }
      });
    });
  }

  public all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }
}

export const db = new Database();

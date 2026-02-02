import sqlite3 from 'sqlite3';
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
declare class Database {
    private db;
    constructor();
    private initialize;
    private seedData;
    run(sql: string, params?: any[]): Promise<sqlite3.RunResult>;
    get<T>(sql: string, params?: any[]): Promise<T | undefined>;
    all<T>(sql: string, params?: any[]): Promise<T[]>;
}
export declare const db: Database;
export {};
//# sourceMappingURL=db.d.ts.map
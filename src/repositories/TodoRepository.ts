import Database from 'better-sqlite3';
import logger from "../utils/logger";
import { Todo, CreateTaskSchema, UpdateTaskSchema, ReadTaskSchema, DeleteTaskSchema } from '../schemas/todoSchemas';

export class TodoRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  public create(todoData: unknown): Todo {
    const parsed = CreateTaskSchema.parse(todoData);
    const stmt = this.db.prepare(`
      INSERT INTO todos (title, description, completed)
      VALUES (@title, @description, @completed)
    `);
    const info = stmt.run({
      title: parsed.title,
      description: parsed.description ?? null,
      completed: parsed.completed ? 1 : 0,
    });

    return { id: info.lastInsertRowid as number, ...parsed };
  }

  public findAll(): Todo[] {
    const stmt = this.db.prepare(`SELECT id, title, description, completed FROM todos`);
    const rows = stmt.all();
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      completed: !!row.completed,
    }));
  }

  public findById(idData: unknown): Todo | null {
    const { id } = ReadTaskSchema.parse(idData);
    const stmt = this.db.prepare(`SELECT id, title, description, completed FROM todos WHERE id = ?`);
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: !!row.completed,
    };
  }

  public update(updateData: unknown): Todo | null {
    const parsed = UpdateTaskSchema.parse(updateData);
    const existing = this.findById({ id: parsed.id });
    if (!existing) return null;

    const stmt = this.db.prepare(`
      UPDATE todos
      SET title = COALESCE(@title, title),
          description = COALESCE(@description, description),
          completed = COALESCE(@completed, completed)
      WHERE id = @id
    `);

    let completedValue: number | null;

    if (typeof parsed.completed === "boolean") {
      completedValue = parsed.completed ? 1 : 0;
    } else {
      completedValue = null;
    }

    stmt.run({
      id: parsed.id,
      title: parsed.title ?? null,
      description: parsed.description ?? null,
      completed: completedValue,
    });

    return this.findById({ id: parsed.id });
  }

  public delete(idData: unknown): boolean {
    logger.debug(typeof (idData))
    const { id } = DeleteTaskSchema.parse(idData);
    const stmt = this.db.prepare(`DELETE FROM todos WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

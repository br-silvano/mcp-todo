import Database from 'better-sqlite3';
import { TodoRepository } from '../src/repositories/TodoRepository';

describe.skip('TodoRepository', () => {
  let db: Database.Database;
  let repo: TodoRepository;

  beforeEach(() => {
    db = new Database(':memory:');
    db.exec(`
    CREATE TABLE todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0
    )
  `);

    repo = new TodoRepository(db);
  });

  afterEach(() => {
    db.close();
  });

  test('deve criar uma nova tarefa', () => {
    const result = repo.create({
      title: 'Teste Jest',
      description: 'Descrição',
      completed: false
    });

    expect(result).toMatchObject({
      id: expect.any(Number),
      title: 'Teste Jest',
      description: 'Descrição',
      completed: false
    });
  });

  test('deve retornar todas as tarefas', () => {
    repo.create({ title: 'A', completed: false });
    repo.create({ title: 'B', completed: true });

    const todos = repo.findAll();
    expect(todos.length).toBe(2);
  });

  test('deve atualizar uma tarefa existente', () => {
    const created = repo.create({ title: 'Old', completed: false });
    const updated = repo.update({ id: created.id, title: 'New', completed: true });

    expect(updated).toMatchObject({
      id: created.id,
      title: 'New',
      completed: true
    });
  });

  test('deve deletar uma tarefa', () => {
    const created = repo.create({ title: 'To Delete', completed: false });
    const deleted = repo.delete({ id: created.id });

    expect(deleted).toBe(true);
  });
});

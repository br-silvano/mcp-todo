import { Todo } from '../schemas/todoSchemas';
import { TodoRepository } from '../repositories/TodoRepository';

export class TodoService {
  constructor(private readonly repository: TodoRepository) { }

  public createTodo(todoData: unknown): Todo {
    return this.repository.create(todoData);
  }

  public getAllTodos(): Todo[] {
    return this.repository.findAll();
  }

  public getTodoById(idData: unknown): Todo | null {
    return this.repository.findById(idData);
  }

  public updateTodo(updateData: unknown): Todo | null {
    return this.repository.update(updateData);
  }

  public deleteTodo(idData: unknown): boolean {
    return this.repository.delete(idData);
  }
}

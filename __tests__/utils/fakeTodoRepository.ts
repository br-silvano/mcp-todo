import { TodoRepository } from '../../src/repositories/TodoRepository';

export const fakeRepo = {
  create: jest.fn().mockReturnValue({ id: 1, title: "Testar ferramenta", completed: false }),
  update: jest.fn().mockReturnValue({ id: 1, title: "Estudar arquitetura hexagonal e DDD", completed: true }),
  delete: jest.fn().mockReturnValue({ id: 1, title: "Testar ferramenta", completed: false }),
  findAll: jest.fn().mockReturnValue([{ id: 1, title: "Testar ferramenta", completed: false }]),
  findById: jest.fn().mockReturnValue({ id: 1, title: "Testar ferramenta", completed: false })
} as unknown as TodoRepository;

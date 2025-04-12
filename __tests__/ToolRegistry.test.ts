import { buildToolRegistry } from '../src/tools/toolsConfig';

describe('ToolRegistry', () => {
  it('deve encontrar a ferramenta "TodoManager"', () => {
    const registry = buildToolRegistry();
    const tool = registry.findByName('TodoManager');

    expect(tool).toBeDefined();
    expect(tool?.name).toBe('TodoManager');
    expect(tool?.capabilities).toHaveLength(5);
  });

  it('deve listar todas as ferramentas registradas', () => {
    const registry = buildToolRegistry();
    const tools = registry.list();

    expect(tools.length).toBeGreaterThan(0);
  });
});

import { AuthenticationService } from "../src/services/AuthenticationService";

describe("AuthenticationService", () => {
  const VALID_API_KEY = "SENHA_SECRETA";
  let authService: AuthenticationService;

  beforeEach(() => {
    authService = new AuthenticationService(VALID_API_KEY);
  });

  test("deve autenticar com chave válida", () => {
    expect(authService.isAuthenticated("SENHA_SECRETA")).toBe(true);
  });

  test("não deve autenticar com chave inválida", () => {
    expect(authService.isAuthenticated("CHAVE_ERRADA")).toBe(false);
  });
});

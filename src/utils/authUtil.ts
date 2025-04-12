import { AuthenticationService } from "../services/AuthenticationService";

export function checkAuthentication(payload: any, authService: AuthenticationService): boolean {
  return payload?.apiKey && authService.isAuthenticated(payload.apiKey);
}

export class AuthenticationService {
  private readonly validApiKey: string;

  constructor(validApiKey: string) {
    this.validApiKey = validApiKey;
  }

  public isAuthenticated(apiKey: string): boolean {
    return apiKey === this.validApiKey;
  }
}

export class MockWebSocket {
  public sentMessages: string[] = [];
  send(message: string): void {
    this.sentMessages.push(message);
  }
}

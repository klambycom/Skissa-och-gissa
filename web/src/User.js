// @flow

export default class User {
  name: string;
  timestamp: number;

  constructor(name: string, timestamp: number) {
    this.name = name;
    this.timestamp = timestamp;
  }

  onlineAt(): string {
    let date = new Date(this.timestamp);
    return date.toLocaleTimeString();
  }
}

export function create_user(user: string, {metas}: Object): User {
  return new User(user, metas[0].online_at);
}

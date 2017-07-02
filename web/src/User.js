// @flow

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (var i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

export default class User {
  name: string;
  color: string;
  timestamp: number;

  constructor(name: string, timestamp: number) {
    this.name = name;
    this.color = stringToColor(name);
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

import {Group} from './group';

export class User{
  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public active?: boolean,
    public groups: Group[] = [],
    public password: string = ''
  ) {}

  public static clone(other: User): User {
    return new User(other.name, other.email, other.id, other.lastLogin, other.active, other.groups, other.password);
  }

  getIdAndName(): string {
    return this.id + ' ' + this.name;
  }

  getFormatLastLogin(): string {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return this.lastLogin ? new Date(this.lastLogin).toLocaleTimeString('en-EN', options) : 'never';
  }
}

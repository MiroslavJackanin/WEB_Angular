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
}

import {Group} from './group';

export class User{
  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public active?: boolean,
    public groups?: Group[],
    public password: string = ''
  ) {}

  getIdAndName(): string {
    return this.id + ' ' + this.name;
  }
}

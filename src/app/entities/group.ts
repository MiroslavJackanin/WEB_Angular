export class Group {
  constructor(
    public id?: number,
    public name: string = '',
    public permissions: string[] = []
  ) {}

  public static clone(other: Group): Group {
    return new Group(other.id, other.name, other.permissions);
  }
}

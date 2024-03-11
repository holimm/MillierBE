export class ContactNodeModel {
  constructor(
    public email?: string,
    public fullname?: string,
    public subject?: string,
    public content?: string,
    public date?: string
  ) {}
}

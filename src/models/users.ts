import { ObjectId } from "mongodb";

export default class UsersModel {
  constructor(
    public username: string,
    public password: number,
    public id?: ObjectId
  ) {}
}

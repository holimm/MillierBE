import { ObjectId } from "mongodb";

export default class UsersModel {
  constructor(
    public username: string,
    public password: string,
    public id?: ObjectId
  ) {}
}

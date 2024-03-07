import { ObjectId } from "mongodb";

export class BlogModel {
  constructor(
    public id?: ObjectId,
    public idTitle?: string,
    public title?: string,
    public content?: string,
    public chapeau?: string,
    public category?: string,
    public images?: {
      thumbnail?: string;
    },
    public author?: {
      name?: string;
      role?: string;
      date?: string;
    },
    public date?: string
  ) {}
}

import { ObjectId } from "mongodb";

export default class ProductsModel {
  constructor(
    public name: string,
    public description: string,
    public lowest_price: number,
    public image: string,
    public id?: ObjectId
  ) {}
}

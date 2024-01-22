import { ObjectId } from "mongodb";

export default class ProductsDetailModel {
  constructor(
    public name: string,
    public name_lower: string,
    public description: string,
    public color: {
      label: string;
      lowercase: string;
    }[],
    public storage: {
      capacity: number;
      unit: string;
      price: number;
    }[],
    public id?: ObjectId
  ) {}
}

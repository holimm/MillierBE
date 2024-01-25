import { ObjectId } from "mongodb";

export default class ProductsDetailModel {
  constructor(
    public name: string,
    public name_lower: string,
    public description: {
      label: string;
      type: string;
      content: {
        text: string;
        image: string;
      }[];
    }[],
    public specs: {
      label: string;
      key: string;
      content: string;
    }[],
    public images: {
      [key: string]: string[];
    },
    public color: {
      label: string;
      lowercase: string;
      color: string;
    }[],
    public storage: {
      capacity: number;
      unit: string;
      price: number;
    }[],
    public id?: ObjectId
  ) {}
}

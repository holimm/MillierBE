import { ObjectId } from "mongodb";

export class ProductsModel {
  constructor(
    public name?: string,
    public key?: string,
    public description?: string,
    public lowest_price?: number,
    public image?: string,
    public category?: string,
    public id?: ObjectId
  ) {}
}

export class CategoryModel {
  constructor(
    public name?: string,
    public image?: string,
    public id?: ObjectId
  ) {}
}

export class ProductColorType {
  constructor(
    public color?: string,
    public label?: string,
    public image?: string,
    public lowercase?: string
  ) {}
}

export class ProductStorageType {
  public constructor(
    public capacity?: number,
    public unit?: string,
    public price?: number
  ) {}
}

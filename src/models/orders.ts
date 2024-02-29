import { ObjectId } from "mongodb";
import { ProductColorType, ProductStorageType } from "./products";

export class OrderInformationType {
  constructor(
    public id?: ObjectId,
    public accountID?: string,
    public name?: string,
    public method?: string,
    public address?: CheckoutFormAddressType,
    public product?: CartType[],
    public total?: number,
    public date?: OrderDateType[],
    public note?: string
  ) {}
}

export class CheckoutFormAddressType {
  constructor(
    public type?: string,
    public phone?: string,
    public street?: string,
    public district?: string,
    public ward?: string,
    public city?: string
  ) {}
}

export class OrderDateType {
  constructor(
    public id?:
      | "dateOrder"
      | "dateDelivering"
      | "dateDelivered"
      | "dateCancelled",
    public dateString?: string
  ) {}
}

export class CartType {
  constructor(
    public name?: string,
    public storage?: ProductStorageType,
    public color?: ProductColorType,
    public quantity?: number
  ) {}
}

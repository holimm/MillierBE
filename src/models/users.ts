import { ObjectId } from "mongodb";

export class UsersAddressUpdateModel {
  constructor(
    public type?: string,
    public phone?: string,
    public street?: string,
    public district?: string,
    public ward?: string,
    public city?: string,
    public index?: number
  ) {}
}

export class UsersModel {
  constructor(
    public username: string,
    public password: string,
    public email: string,
    public name: string,
    public token: string,
    public phone: string,
    public address: UsersAddressUpdateModel[],
    public id?: ObjectId
  ) {}
}

export class UsersPasswordUpdateModel {
  constructor(
    public old_password: string,
    public new_password: string,
    public new_password_confirm: string,
    public id?: ObjectId
  ) {}
}

export class UsersInformationUpdateModel {
  constructor(
    public name: string,
    public phone: string,
    public id?: ObjectId
  ) {}
}

export class RegisterAccountModel {
  constructor(
    public name?: string,
    public username?: string,
    public password?: string,
    public confirm_password?: string,
    public email?: string,
    public phone?: string,
    public address?: UsersAddressUpdateModel[],
    public token?: string
  ) {}
}

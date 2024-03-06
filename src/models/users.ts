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
    public emailVerifyToken: string,
    public verifyTokenExpireDate: string,
    public statusVerify: boolean,
    public id?: ObjectId
  ) {}
}

export class UsersPasswordUpdateModel {
  constructor(
    public old_password: string,
    public password: string,
    public password_confirm: string,
    public id?: ObjectId
  ) {}
}

export class UsersInformationUpdateModel {
  constructor(
    public name?: string,
    public username?: string,
    public phone?: string,
    public id?: ObjectId,
    public password?: string,
    public password_confirm?: string
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

export class ForgotPasswordAccountModel {
  constructor(public email?: string) {}
}

export class GoogleLoginCodeResponseType {
  constructor(
    public access_token?: string,
    public authuser?: string,
    public expires_in?: number,
    public prompt?: string,
    public scope?: string,
    public token_type?: string
  ) {}
}

export class GoogleProfileType {
  constructor(
    public email?: string,
    public family_name?: string,
    public given_name?: string,
    public id?: string,
    public locale?: string,
    public name?: string,
    public picture?: string,
    public verified_email?: boolean
  ) {}
}

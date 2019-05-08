export interface IPostAddress {
  Street: string
  PLZ: string
  City: string
}

export interface IUpdateAddress extends IPostAddress {

}

export interface IAddress extends IUpdateAddress {
  AddressId: number
}

export const emtpyAddress: IPostAddress = {
  Street: "",
  PLZ: "",
  City: "",
}

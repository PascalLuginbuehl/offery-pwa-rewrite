import { IAddress } from "../interfaces/IAddress"

// export interface AdminCompanyRegisterModel {

// }

export interface AdminCompanyUpdateModel {


  WebsiteURL: string
  HeadQuarterAddress: IAddress
  VatUID: string
  Telephone: string
  Name: string
  Email: string
  ContactPersonId: string
}

export interface AdminCompanyModel extends AdminCompanyUpdateModel {
  CompanyId: number
}

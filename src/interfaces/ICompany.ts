import { IUser } from "./IUser"
import { IProduct } from "./IProduct"
import { CompanySettingModel } from "../models"

export interface IAddress {
  AddressId: number
  Street: string
  PLZ: string
  City: string
}
export interface IOfferTemplate {
  OfferTemplateId: number
  Name: string
  DocName: string
  LanguageCode: string
}
export interface IOfferTemplateCategory {
  NameTextKey: string
  OfferTemplateCategoryId: number
  OfferTemplates: IOfferTemplate[]
}

export interface ICarType {
  CarTypeId: number
  NameTextKey: string
}

export interface ICompany {
  CompanyId: number
  Name: string
  Email: string
  Telephone: string
  VatUID: string
  HeadQuarter: IAddress
  EmployeeUsers: IUser[]
  ShopProducts: IProduct[]
  OfferTemplateCategories: IOfferTemplateCategory[]
  ContactPerson: IUser
  Addresses: IAddress[]
  Settings: CompanySettingModel
  CarTypes: ICarType[]
}

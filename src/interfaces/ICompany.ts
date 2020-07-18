import { IUser } from "./IUser"
import { IProduct } from "./IProduct"
import { CompanySettingModel, OfferTemplateCategoryDTO } from "../models"

export interface IAddress {
  AddressId: number
  Street: string
  PLZ: string
  City: string
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
  OfferTemplateCategories: OfferTemplateCategoryDTO[]
  ContactPerson: IUser
  Addresses: IAddress[]
  Settings: CompanySettingModel
  CarTypes: ICarType[]
}

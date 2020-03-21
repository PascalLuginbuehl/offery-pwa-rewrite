import { IUser } from "./IUser"
import { IProduct } from "./IProduct"

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

export interface ICompanySetting {

  //Conditiontypes
  EnableDefaultHourPrice: boolean
  EnableDefaultHasCostCeiling: boolean
  HourlyPriceRangeJSON: number[]

  //Move
  EnableServiceMoveMontagePrice: boolean
  EnableServiceMoveDemontagePrice: boolean

  //Storage
  EnableServiceStorageMontagePrice: boolean
  EnableServiceStorageDemontagePrice: boolean

  //Disposal
  EnableServiceDisposalDemontagePrice: boolean

  //Email
  VisitConfirmEmailSubjectTextKey: string
  VisitConfirmEmailBodyContentIntroTextKey: string
  VisitConfirmEmailBodyContentOutroTextKey: string
  OfferEmailSubjectTextKey: string
  OfferEmailBodyContentIntroTextKey: string
  OfferEmailBodyContentOutroTextKey: string

  AppointmentVisitDuration: number
  AppointmentMoveDuration: number
  AppointmentPackDuration: number
  AppointmentDeliveryDuration: number
  AppointmentStorageDuration: number
  AppointmentDisposalDuration: number
  AppointmentCleaningDuration: number
  AppointmentHandOverDuration: number
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
  Settings: ICompanySetting
  CarTypes: ICarType[]
}

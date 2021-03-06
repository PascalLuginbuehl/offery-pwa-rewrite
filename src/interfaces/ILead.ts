import {  IAddress } from "./IAddress"
import { IPackServiceConditions, ICleaningServiceConditions, IStorageServiceConditions, IDisposalServiceConditions, IMoveServiceConditions } from "./IConditions"
import { IOffer } from "./IOffer"
import { IServices } from "./IService"
import { RegisterInternalNoteModel, InternalNoteModel } from "../models/InternalNoteModel"

export interface IPostCustomer {
  Firstname: string
  Lastname: string
  IsMale: boolean
  CompanyName: string
  TelephoneNumber: string
  Email: string
  PrefferedLanguage: "DE" | "IT" | "FR" | "EN"
}

export type IUpdateCustomer = IPostCustomer

export interface IStatus {
  StatusId: number
  NameTextKey: string
  OrderNumber: number | null
}

export interface ICustomer extends IUpdateCustomer {
  CustomerId: number
}

export interface IPostLead {
  Notes: Array<InternalNoteModel | RegisterInternalNoteModel>

  Customer: IPostCustomer
  VisitDate: Date | null
  MoveDate: Date | null
  PackServiceDate: Date | null
  DisposalDate: Date | null
  StorageDate: Date | null
  CleaningDate: Date | null
  HandOverDate: Date | null
  DeliveryDate: Date | null
  CollectBackDate: Date | null

  Comment: string
}

export interface IPutLead extends IPostLead {
  MoveServiceConditions: IMoveServiceConditions
  PackServiceConditions: IPackServiceConditions
  DisposalServiceConditions: IDisposalServiceConditions
  StorageServiceConditions: IStorageServiceConditions
  CleaningServiceConditions: ICleaningServiceConditions

  Services: IServices
}

export interface IUpdateLead extends IPutLead {
  LeadId: number
  Customer: IUpdateCustomer
}

export interface ICompressedLead extends IUpdateLead {
  Customer: ICustomer
  Created: Date

  // LeadId: number
  Status: IStatus

  Addresses: IAddress[]
}

export interface ILead extends ICompressedLead {
  Notes: InternalNoteModel[]

  StatusHistories: Array<{
    StatusHistoryId: number
    Created: Date
    Status: IStatus
    Comment: string
    CSettingEmailTypeId: number | null
  }>

  AppointmentReminders: Array<{
    AppointmentReminderId: number
    Created: Date
    From: string
    To: string
    AppointmentTypeTextKey: string
    NotificationType: string
    AppointedDate: Date
    Succeed: boolean
    ErrorMessage: string
  }>

  Offers: IOffer[]

  ConfirmedOrderVerbal: boolean
  ConfirmedOrder: boolean | null
  ConfirmedOffer: IOffer | null

  BillBuildingId: number | null
}

export const emptyCustomer: IPostCustomer = {
  Firstname: "",
  Lastname: "",
  IsMale: true,
  CompanyName: "",
  TelephoneNumber: "",
  Email: "",
  PrefferedLanguage: "DE"
}

export const emptyLead: IPostLead = {
  VisitDate: null,
  MoveDate: null,
  PackServiceDate: null,
  DisposalDate: null,
  StorageDate: null,
  CleaningDate: null,
  HandOverDate: null,
  DeliveryDate: null,
  CollectBackDate: null,

  Comment: "",

  Customer: emptyCustomer,
  Notes: [],
}

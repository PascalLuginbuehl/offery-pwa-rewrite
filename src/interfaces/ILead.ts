import { IPostAddress, IAddress } from "./IAddress";
import { IPackServiceConditions, ICleaningServiceConditions, IStorageServiceConditions, IDisposalServiceConditions, IMoveServiceConditions } from "./IConditions";

export interface IPostCustomer {
  Firstname: string
  Lastname: string
  IsMale: boolean
  CompanyName: string
  TelephoneNumber: string
  Email: string
  PrefferedLanguage: "DE" | "IT" | "FR" | "EN"
}

export interface IUpdateCustomer extends IPostCustomer {

}

export interface IStatus {
  StatusId: number
  NameTextKey: string
}

export interface ICustomer extends IUpdateCustomer {
  CustomerId: number
}

export interface IPostLead {
  Customer: IPostCustomer

  VisitDate: Date | null
  MoveDate: Date | null
  PackServiceDate: Date | null
  DisposalDate: Date | null
  StorageDate: Date | null
  CleaningDate: Date | null
  HandOverDate: Date | null
  DeliveryDate: Date | null

  HasMoveOutBuilding: boolean
  HasMoveInBuilding: boolean
  HasStorageInBuilding: boolean
  HasCleaningBuilding: boolean
  HasDisposalOutBuilding: boolean

  Comment: string
}

export interface IUpdateLead extends IPostLead {
  LeadId: number
  Customer: IUpdateCustomer
}

export interface ICompressedLead extends IUpdateLead {
  Customer: ICustomer
  Created: Date

  // LeadId: number
  Status: IStatus

  // VisitDate: Date
  FromAddress: IAddress | null
  ToAddress: IAddress | null
}


export interface ILead extends ICompressedLead {
  // Created: Date
  // Customer: ICustomer

  // Status: IStatus
  VisitDate: Date

  StatusHistories: Array<{
    StatusHistoryId: number
    Created: Date
    Status: IStatus
  }>

  MoveServiceConditions: IMoveServiceConditions | null
  PackServiceConditions: IPackServiceConditions | null
  DisposalServiceConditions: IDisposalServiceConditions | null
  StorageServiceConditions: IStorageServiceConditions | null
  CleaningServiceConditions: ICleaningServiceConditions | null
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
  Comment: "",

  Customer: {
    Firstname: "",
    Lastname: "",
    IsMale: true,
    CompanyName: "",
    TelephoneNumber: "",
    Email: "",
    PrefferedLanguage: "DE"
  },

  HasCleaningBuilding: false,
  HasDisposalOutBuilding: false,
  HasMoveInBuilding: true,
  HasMoveOutBuilding: true,
  HasStorageInBuilding: false,
}

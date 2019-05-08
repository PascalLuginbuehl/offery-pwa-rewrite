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

export interface Status {
  StatusId: number
  NameTextKey: string
}

export interface ICustomer extends IUpdateCustomer {
  CustomerId: number
}

export interface ILead extends IUpdateLead {
  Created: Date

  Customer: ICustomer

  Status: Status
  StatusHistories: Array<{
    StatusHistoryId: number
    Created: Date,
    Status: Status
  }>,
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

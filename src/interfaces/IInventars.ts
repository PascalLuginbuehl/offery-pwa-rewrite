export interface IFSize {
  FSizeId: number
  NameTextKey: string
  OrderNumber: number
}

export interface IFMaterial {
  FMaterialId: number
  NameTextKey: string
  OrderNumber: number
}

export interface IInventar {
  // InventarId: number

  Amount: number
  FurnitureId: number
  FSize: IFSize | null
  FMaterial: IFMaterial | null
}


export interface ICustomInventar {
  Amount: number
  Name: string
  Description: string
}

export interface IInventars {
  MoveServiceInventars: IInventar[]
  CustomMoveServiceInventars: ICustomInventar[]
  MoveServiceComment: string

  DisposalServiceInventars: IInventar[]
  CustomDisposalServiceInventars: ICustomInventar[]
  DisposalServiceComment: string

  StorageServiceInventars: IInventar[]
  CustomStorageServiceInventars: ICustomInventar[]
  StorageServiceComment: string
}



export enum InventoryKeysEnum {
  Move = "MoveServiceInventars",
  Disposal = "DisposalServiceInventars",
  Storage = "StorageServiceInventars",
}


export const emptyInventory: IInventars  = {
  MoveServiceInventars: [],
  CustomMoveServiceInventars: [],
  MoveServiceComment: "",

  DisposalServiceInventars: [],
  CustomDisposalServiceInventars: [],
  DisposalServiceComment: "",

  StorageServiceInventars: [],
  CustomStorageServiceInventars: [],
  StorageServiceComment: "",
}

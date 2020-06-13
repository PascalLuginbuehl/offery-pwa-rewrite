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

  DisposalServiceInventars: IInventar[]
  CustomDisposalServiceInventars: ICustomInventar[]

  StorageServiceInventars: IInventar[]
  CustomStorageServiceInventars: ICustomInventar[]
}



export enum InventoryKeysEnum {
  Move = "MoveServiceInventars",
  Disposal = "DisposalServiceInventars",
  Storage = "StorageServiceInventars",
}


export const emptyInventory: IInventars  = {
  MoveServiceInventars: [],
  CustomMoveServiceInventars: [],

  DisposalServiceInventars: [],
  CustomDisposalServiceInventars: [],

  StorageServiceInventars: [],
  CustomStorageServiceInventars: [],
}

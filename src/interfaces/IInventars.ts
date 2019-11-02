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
  FSize: IFSize
  FMaterial: IFMaterial
}

export interface IInventars {
  MoveServiceInventars: IInventar
  MoveServiceComment: string

  DisposalServiceInventars: IInventar
  DisposalServiceComment: string

  StorageServiceInventars: IInventar
  StorageServiceComment: string
}



export enum InventoryKeysEnum {
  Move = "MoveServiceInventars",
  Pack = "DisposalServiceInventars",
  Storage = "StorageServiceInventars",
}

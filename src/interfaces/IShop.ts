export interface IOrderPosition {
  Amount: number
  IsRent: boolean
  IsForFree: boolean
  ProductId: number
}

export interface IMaterialOrder {
  // MaterialOrderId: number
  DeliveryDate: Date
  DeliveryCostFix: number
  Comment: string
  MoveServicePositions: IOrderPosition[]
  PackServicePositions: IOrderPosition[]
  StorageServicePositions: IOrderPosition[]
}

export enum CurrentlyOpenStateEnum {
  Buy,
  Rent,
  Free,
}

export enum ShopTypeEnum {
  Move = "MoveServicePositions",
  Pack = "PackServicePositions",
  Storage = "StorageServicePositions",
}


export const emptyMaterialOrder: IMaterialOrder = {
  DeliveryDate: new Date(),
  DeliveryCostFix: 0,
  Comment: "",
  MoveServicePositions: [],
  PackServicePositions: [],
  StorageServicePositions: [],
}

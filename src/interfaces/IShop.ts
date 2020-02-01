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
  OrderPositions: IOrderPosition[]
}

export enum CurrentlyOpenStateEnum {
  Buy,
  Rent,
  Free,
}

export const emptyMaterialOrder: IMaterialOrder = {
  DeliveryDate: new Date(),
  DeliveryCostFix: 0,
  Comment: "",
  OrderPositions: [],
}

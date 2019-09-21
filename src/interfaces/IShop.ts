export interface IOrderPosition {
  OrderPositionId: number
  Amount: number
  IsRent: boolean
  IsForFree: boolean
  ProductId: number
}

export interface IMaterialOrder {
  MaterialOrderId: number
  DeliveryDate: string
  DeliveryCostFix: number
  Comment: string
  MoveServicePositions: IOrderPosition[]
  PackServicePositions: IOrderPosition[]
  StorageServicePositions: IOrderPosition[]
}

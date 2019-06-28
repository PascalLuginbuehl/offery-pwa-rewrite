export interface IPostMoveService {
  MoveDate: Date
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  BoreService: boolean
}

export interface IMoveService extends IPostMoveService {
  MoveServiceId: number
}

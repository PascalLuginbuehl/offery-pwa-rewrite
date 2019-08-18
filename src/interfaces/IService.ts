export interface IPutMoveService {
  MoveDate: Date
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  BoreService: boolean
}

export interface IMoveService extends IPutMoveService {
  MoveServiceId: number
}

export interface IPutCleaningService {
  CleaningDate: Date,
  HandOverDate: string
  Comment: string
  HighPressureTerraceCleaningService: boolean
  HighPressureGarageCleaningService: boolean
  DovelholeService: boolean
  CleaningFireplaceService: boolean
  CleaningCarpetService: boolean
  CleaningWindowsService: boolean
  CleaningWindowsWithShuttersService: boolean
  CleaningSpecialService: boolean
  HandoutGaranty: boolean
}

export interface ICleaningSerivce extends IPutCleaningService {
  CleaningServiceId: number,
}

export interface IMaterialOrder {

}

export interface IPutDisposalSerivce {
  DisposalDate: string
  FurnitureLiftService: boolean
  DeMontage: boolean
  LampDemontageService: boolean
}

export interface IDisposalSerivce extends IPutDisposalSerivce {
  DisposalServiceId: number
}

export interface IPutPackService {
  PackServiceDate: boolean,
  HasOutService: boolean
}
export interface IPackSerivce {
  PackServiceId: number
}

export interface IPutStorageService {
  StorageDate: string
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  BoreService: boolean
}

export interface IStorageSerivce extends IPutStorageService {
  StorageServiceId: number
}

export interface IPutServices {
  HasMoveServiceEnabled: boolean
  HasPackServiceEnabled: boolean
  HasStorageServiceEnabled: boolean
  HasDisposalServiceEnabled: boolean
  HasCleaningServiceEnabled: boolean
}

export interface IServices extends IPutServices {
  LeadId: number
}

export const emptyServices: IPutServices = {
  HasMoveServiceEnabled: false,
  HasPackServiceEnabled: false,
  HasStorageServiceEnabled: false,
  HasDisposalServiceEnabled: false,
  HasCleaningServiceEnabled: false,
}

export interface IPutMoveService {
  MoveDate: Date | null
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
  CleaningDate: Date | null
  HandOverDate: Date | null
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

export interface ICleaningService extends IPutCleaningService {
  CleaningServiceId: number,
}

export interface IMaterialOrder {

}

export interface IPutDisposalSerivce {
  DisposalDate: Date | null
  FurnitureLiftService: boolean
  DeMontage: boolean
  LampDemontageService: boolean
}

export interface IDisposalSerivce extends IPutDisposalSerivce {
  DisposalServiceId: number
}

export interface IPutPackService {
  PackServiceDate: Date | null,
  HasOutService: boolean
}
export interface IPackSerivce extends IPutPackService {
  PackServiceId: number
}

export interface IPutStorageService {
  StorageDate: string | null
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

export const emptyMoveService: IPutMoveService = {
  BoreService: false,
  DeMontageService: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  MontageService: false,
  PianoService: false,
  MoveDate: null,
}


export const emptyPackService: IPutPackService = {
  HasOutService: false,
  PackServiceDate: null
}


export const emptyStorageService: IPutStorageService = {
  BoreService: false,
  DeMontageService: false,
  FurnitureLiftService:false,
  LampDemontageService: false,
  MontageService: false,
  PianoService: false,
  StorageDate: null,
}


export const emptyDisposalService: IPutDisposalSerivce = {
  DeMontage: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  DisposalDate: null,
}

export const emptyCleaningService: IPutCleaningService = {
  CleaningCarpetService: false,
  CleaningFireplaceService: false,
  CleaningSpecialService: false,
  CleaningWindowsService: false,
  CleaningWindowsWithShuttersService: false,
  DovelholeService: false,
  HandoutGaranty: false,
  HighPressureGarageCleaningService: false,
  HighPressureTerraceCleaningService: false,
  CleaningDate: null,
  HandOverDate: null,
  Comment: "",
}

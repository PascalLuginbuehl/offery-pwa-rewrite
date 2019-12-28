export interface IPutMoveService {
  MoveDate: Date | null
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  HeavyLiftService: boolean
  BoreService: boolean
  Comment: string
}

export interface IMoveService extends IPutMoveService {
  MoveServiceId: number
}

export interface IPutCleaningService {
  CleaningDate: Date | null
  HandOverDate: Date | null
  HighPressureTerraceCleaningService: boolean
  HighPressureGarageCleaningService: boolean
  DovelholeService: boolean
  CleaningFireplaceService: boolean
  CleaningCarpetService: boolean
  CleaningWindowsService: boolean
  CleaningWindowsWithShuttersService: boolean
  CleaningSpecialService: boolean
  HandoutGaranty: boolean
  Comment: string
}

export interface ICleaningService extends IPutCleaningService {
  CleaningServiceId: number
}

export interface IPutDisposalService {
  DisposalDate: Date | null
  HeavyLiftService: boolean
  FurnitureLiftService: boolean
  DeMontage: boolean
  LampDemontageService: boolean
  Comment: string
}
export interface IDisposalSerivce extends IPutDisposalService {
  DisposalServiceId: number
}

export interface IPutPackService {
  HeavyLiftService: boolean
  PackServiceDate: Date | null
  HasOutService: boolean
  Comment: string
}
export interface IPackSerivce extends IPutPackService {
  PackServiceId: number
}

export interface IPutStorageService {
  HeavyLiftService: boolean
  StorageDate: string | null
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  BoreService: boolean
  Comment: string
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
  Comment: string
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
  Comment: ""
}

export const emptyMoveService: IPutMoveService = {
  HeavyLiftService: false,
  BoreService: false,
  DeMontageService: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  MontageService: false,
  PianoService: false,
  MoveDate: null,
  Comment: ""
}

export const emptyPackService: IPutPackService = {
  HeavyLiftService: false,
  HasOutService: false,
  PackServiceDate: null,
  Comment: ""
}

export const emptyStorageService: IPutStorageService = {
  HeavyLiftService: false,
  BoreService: false,
  DeMontageService: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  MontageService: false,
  PianoService: false,
  StorageDate: null,
  Comment: ""
}

export const emptyDisposalService: IPutDisposalService = {
  HeavyLiftService: false,
  DeMontage: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  DisposalDate: null,
  Comment: ""
}

export const emptyCleaningService: IPutCleaningService = {
  CleaningCarpetService: false,
  CleaningFireplaceService: false,
  CleaningSpecialService: false,
  CleaningWindowsService: false,
  CleaningWindowsWithShuttersService: false,
  DovelholeService: false,
  HandoutGaranty: true,
  HighPressureGarageCleaningService: false,
  HighPressureTerraceCleaningService: false,
  CleaningDate: null,
  HandOverDate: null,
  Comment: "",
}

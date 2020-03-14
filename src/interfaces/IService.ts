export interface IPutMoveService {
  OutBuildingId: number | null
  InBuildingId: number | null

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
  BuildingId: number | null

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
  BuildingId: number | null

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
  BuildingId: number | null

  HeavyLiftService: boolean
  PackServiceDate: Date | null
  HasOutService: boolean
  Comment: string
}
export interface IPackSerivce extends IPutPackService {
  PackServiceId: number
}

export interface IPutStorageService {
  OutBuildingId: number | null
  StorageBuildingId: number | null
  InBuildingId: number | null

  HeavyLiftService: boolean
  StorageDate: string | null
  FurnitureLiftService: boolean
  PianoService: boolean
  MontageService: boolean
  DeMontageService: boolean
  LampDemontageService: boolean
  BoreService: boolean
  Comment: string

  CompanyName: string
  ContactPersonFullName: string
  ContactPersonTel: string
  ContactPersonEMail: string
}

export interface IStorageSerivce extends IPutStorageService {
  StorageServiceId: number
}

export interface IServices {
  HasMoveServiceEnabled: boolean
  HasPackServiceEnabled: boolean
  HasStorageServiceEnabled: boolean
  HasDisposalServiceEnabled: boolean
  HasCleaningServiceEnabled: boolean
}

export const emptyMoveService: IPutMoveService = {
  InBuildingId: null,
  OutBuildingId: null,

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
  BuildingId: null,

  HeavyLiftService: false,
  HasOutService: false,
  PackServiceDate: null,
  Comment: ""
}

export const emptyStorageService: IPutStorageService = {
  InBuildingId: null,
  StorageBuildingId: null,
  OutBuildingId: null,

  HeavyLiftService: false,
  BoreService: false,
  DeMontageService: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  MontageService: false,
  PianoService: false,
  StorageDate: null,
  Comment: "",

  CompanyName: "",
  ContactPersonFullName: "",
  ContactPersonTel: "",
  ContactPersonEMail: "",
}

export const emptyDisposalService: IPutDisposalService = {
  BuildingId: null,

  HeavyLiftService: false,
  DeMontage: false,
  FurnitureLiftService: false,
  LampDemontageService: false,
  DisposalDate: null,
  Comment: ""
}

export const emptyCleaningService: IPutCleaningService = {
  BuildingId: null,

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

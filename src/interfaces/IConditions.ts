export interface IServiceConditions {
  IsHourlyRate: boolean
  HasCostCeiling: boolean
  PricePerHour: number | null
  MinHoursOfWork: number | null
  MaxHoursOfWork: number | null
  EstimatedHoursOfWorkWhenFixPrice: number | null
  WorkersAmount: number | null
  DriveHours: number | null

  Comment: string

  CostCeiling: number | null
  FixPrice: number | null
  Expenses: number | null
  DiscountInPercent: number | null
}

export interface ICarType {
  CarTypeId: number
  NameTextKey: string
}

export interface ICarAmount {
  Amount: number
  CarType: ICarType
}

export interface IMoveServiceConditions {

  ServiceConditions: IServiceConditions
  FurnitureLiftPrice: number | null
  PianoPrice: number | null
  MontageServicePrice: number | null
  DeMontageServicePrice: number | null
  LampDemontageAmount: number | null
  LampDemontagePrice: number | null
  BoreAmount: number | null
  BorePrice: number | null
  CarAmounts: ICarAmount[]
}

export interface IPackServiceConditions {
  ServiceConditions: IServiceConditions
}


export interface IDisposalServiceConditions {
  ServiceConditions: IServiceConditions

  FurnitureLiftPrice: number | null
  CostPerCubicInMoney: number | null
  CostEntry: number | null
  Volume: number | null
  LampDemontageAmount: number | null
  LampDemontagePrice: number | null
  CarAmounts: ICarAmount[]
}

export interface IStorageServiceConditions {
  ServiceConditions: IServiceConditions

  FurnitureLiftPrice: number | null
  PianoPrice: number | null
  CostPerCubicMonthInMoney: number | null
  Volume: number | null
  MontageServicePrice: number | null
  DeMontageServicePrice: number | null
  LampDemontageAmount: number | null
  LampDemontagePrice: number | null
  BoreAmount: number | null
  BorePrice: number | null
  CarAmounts: ICarAmount[]
}


export interface ICleaningServiceConditions {

  FixPrice: number | null
  EstimatedHoursOfWorkWhenFixPrice: number | null
  DiscountInPercent: number | null

  Comment: string

  HighPressureTerraceCleaningFixPrice: number | null
  HighPressureGarageCleaningFixPrice: number | null

  DovelholeAmount: number | null
  DovelholePrice: number | null
  CleaningFireplacePrice: number | null
  CleaningCarpetPrice: number | null

  CleaningWindowsPrice: number | null
  CleaningWindowsWithShuttersPrice: number | null

  CleaningSpecialComment: string
  CleaningSpecialPrice: number | null

  WorkersAmount: number | null
  HandoutGaranty: boolean
}


export const emptyServiceConditions: IServiceConditions = {
  IsHourlyRate: true,
  HasCostCeiling: false,
  PricePerHour: null,
  MinHoursOfWork: null,
  MaxHoursOfWork: null,
  EstimatedHoursOfWorkWhenFixPrice: null,
  WorkersAmount: null,
  DriveHours: null,

  Comment: "",

  CostCeiling: null,
  FixPrice: null,
  Expenses: null,
  DiscountInPercent: null,
}


export const emptyMoveServiceConditions: IMoveServiceConditions = {
  ServiceConditions: emptyServiceConditions,
  FurnitureLiftPrice: null,
  PianoPrice: null,
  MontageServicePrice: null,
  DeMontageServicePrice: null,
  LampDemontageAmount: null,
  LampDemontagePrice: null,
  BoreAmount: null,
  BorePrice: null,
  CarAmounts: [],
}


export const emptyPackServiceConditions: IPackServiceConditions = {
  ServiceConditions: emptyServiceConditions,
}

export const emptyDisposalServiceConditions: IDisposalServiceConditions = {
  ServiceConditions: emptyServiceConditions,

  FurnitureLiftPrice: null,
  CostPerCubicInMoney: null,
  CostEntry: null,
  Volume: null,
  LampDemontageAmount: null,
  LampDemontagePrice: null,
  CarAmounts: [],
}

export const emptyStorageServiceConditions: IStorageServiceConditions = {
  ServiceConditions: emptyServiceConditions,

  FurnitureLiftPrice: null,
  PianoPrice: null,
  CostPerCubicMonthInMoney: null,
  Volume: null,
  MontageServicePrice: null,
  DeMontageServicePrice: null,
  LampDemontageAmount: null,
  LampDemontagePrice: null,
  BoreAmount: null,
  BorePrice: null,
  CarAmounts: [],
}


export const emptyCleaningServiceConditions: ICleaningServiceConditions = {
  FixPrice: null,
  EstimatedHoursOfWorkWhenFixPrice: null,
  DiscountInPercent: null,

  Comment: "",

  HighPressureTerraceCleaningFixPrice: null,
  HighPressureGarageCleaningFixPrice: null,
  DovelholeAmount: null,
  DovelholePrice: null,
  CleaningFireplacePrice: null,
  CleaningCarpetPrice: null,
  CleaningWindowsPrice: null,
  CleaningWindowsWithShuttersPrice: null,

  CleaningSpecialComment: "",

  CleaningSpecialPrice: null,
  WorkersAmount: null,
  HandoutGaranty: false,
}

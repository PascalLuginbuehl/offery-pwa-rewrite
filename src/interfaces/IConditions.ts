export interface IServiceConditions {
  IsHourlyRate: boolean
  HasCostCeiling: boolean
  PricePerHour: number
  MinHoursOfWork: number
  MaxHoursOfWork: number
  EstimatedHoursOfWorkWhenFixPrice: number
  WorkersAmount: number
  DriveHours: number

  Comment: string

  CostCeiling: number
  FixPrice: number
  Expenses: number
  DiscountInPercent: number
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
  FurnitureLiftPrice: number
  PianoPrice: number
  MontageServicePrice: number
  DeMontageServicePrice: number
  LampDemontageAmount: number
  LampDemontagePrice: number
  BoreAmount: number
  BorePrice: number
  CarAmounts: ICarAmount[]
}

export interface IPackServiceConditions {
  ServiceConditions: IServiceConditions
}


export interface IDisposalServiceConditions {
  ServiceConditions: IServiceConditions

  FurnitureLiftPrice: number
  CostPerCubicInMoney: number
  CostEntry: number
  Volume: number
  LampDemontageAmount: number
  LampDemontagePrice: number
  CarAmounts: ICarAmount[]
}

export interface IStorageServiceConditions {
  ServiceConditions: IServiceConditions

  FurnitureLiftPrice: number
  PianoPrice: number
  CostPerCubicMonthInMoney: number
  Volume: number
  MontageServicePrice: number
  DeMontageServicePrice: number
  LampDemontageAmount: number
  LampDemontagePrice: number
  BoreAmount: number
  BorePrice: number
  CarAmounts: ICarAmount[]
}


export interface ICleaningServiceConditions {
  ServiceConditions: IServiceConditions

  FixPrice: number
  EstimatedHoursOfWorkWhenFixPrice: number
  FixPriceTotal: number
  DiscountInPercent: number

  Comment: string

  HighPressureTerraceCleaningFixPrice: number
  HighPressureGarageCleaningFixPrice: number
  DovelholeAmount: number
  DovelholePrice: number
  CleaningFireplacePrice: number
  CleaningCarpetPrice: number
  CleaningWindowsPrice: number
  CleaningWindowsWithShuttersPrice: number

  CleaningSpecialComment: string

  CleaningSpecialPrice: number
  WorkersAmount: number
  HandoutGaranty: boolean
}

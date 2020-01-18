export interface IServiceConditions {
  IsHourlyRate: boolean
  HasCostCeiling: boolean
  PricePerHour: number | null
  MinHoursOfWork: number | null
  MaxHoursOfWork: number | null
  EstimatedHoursOfWorkWhenFixPrice: number | null
  WorkersAmount: number | null
  DriveHours: number | null

  CostCeilingHoursOfWork: number | null
  FixPrice: number | null
  Expenses: number | null
  DiscountInPercent: number | null

  PaymentMethodId: number | null

  HeavyLiftPrice: number | null
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
  DeMontageServicePrice: number | null
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

  PaymentMethodId: number | null
}


export enum AppointmentTypeEnum {
  Visit = 0,
  Move = 1,
  PackServiceDate = 2,
  DisposalDate = 3,
  StorageDate = 4,
  CleaningDate = 5,
  HandOverDate = 6,
  DeliveryDate = 7
}

export enum EmailTypeEnum {
  AppointmentConfirm = 0,
  Offer = 1,
  AcceptConfirm = 2,
  CancelConfirm = 3,
  AppointmentReminder = 4,
  GeneralCommunication = 5,
}

export interface EmailTypeModel {

  CSettingEmailTypeId: number
  EmailType: EmailTypeEnum

  AppointmentType: AppointmentTypeEnum | null
  SubjectTextKey: string | null
  BodyContentIntroTextKey: string | null
  BodyContentMainTextKey: string | null
  BodyContentOutroTextKey: string | null
}
export interface CompanyBuildingSettingDTO {
  RoomAmount: boolean
  TotalArea: boolean
  StairsToEntryAmount: boolean
  MetersToParking: boolean
  PeopleLivingAmount: boolean
  RestroomAmount: boolean
  WindowNormalAmount: boolean
  WindowHighVerticalAmount: boolean
  HadSmoked: boolean
  HasMoldAtWindow: boolean
  HasMoldAtWall: boolean
  HasHardenedDirt: boolean
  HadPets: boolean
  HasBasement: boolean
  HasAttic: boolean
  HasGarden: boolean
  HasWinterGarden: boolean
  Comment: boolean
  Etage: boolean
  Elevator: boolean
  BuildingAge: boolean
  BuildingType: boolean
  BuildingTypeDetail: boolean
  Balcony: boolean
  FloorType: boolean
  RollerBlindType: boolean
  GarageType: boolean
  PollutionDegree: boolean
  BuiltInWardrobeRange: boolean
}

export interface CompanySettingModel {
  EmailTypes: EmailTypeModel[]

  DefaultServiceTimeStart: number //0 - 24 -> 8 => 08:00
  DefaultFurnitureLiftPrice: number | null
  DefaultPianoPrice: number | null
  DefaultHeavyLiftPrice: number | null
  DefaultCostEntry: number | null
  DefaultCostPerCubicInMoney: number | null
  DefaultPaymentMethodTextKey: string

  //Conditiontypes Hourly/CostCeiling/Fixprice
  EnableHourPice: boolean
  EnableDefaultHourPrice: boolean
  HourlyPriceRangeJSON: number[]  //info: JsonConvert.SerializeObject(new double[]{ 80.00, 100.00, 120.00 })

  EnableCostCeiling: boolean
  EnableDefaultHasCostCeiling: boolean

  EnableFixPrice: boolean
  EnabledPaymentMethodTextKeys: string[] //info: JsonConvert.SerializeObject(new string[]{ Consts.CASH, etc. })
  EnableWorkerExpenses: boolean

  //Move
  EnableServiceMove: boolean
  EnableServiceMoveBore: boolean
  EnableServiceMoveBoreAmount: boolean
  EnableServiceMoveBorePrice: boolean
  EnableServiceMoveMontage: boolean
  EnableServiceMoveMontagePrice: boolean
  EnableServiceMoveDemontage: boolean
  EnableServiceMoveDemontagePrice: boolean
  EnableServiceMoveLampDemontage: boolean
  EnableServiceMoveLampDemontageAmount: boolean
  EnableServiceMoveLampDemontagePrice: boolean
  EnableServiceMoveFurnitureLift: boolean
  EnableServiceMoveFurnitureLiftPrice: boolean
  EnableServiceMoveHeavyLift: boolean
  EnableServiceMoveHeavyLiftPrice: boolean
  EnableServiceMovePiano: boolean
  EnableServiceMovePianoPrice: boolean
  EnableServiceMoveComment: boolean

  //Cleaning
  EnableServiceCleaning: boolean
  EnableServiceCleaningEstimatedHoursOfWorkWhenFixPrice: boolean
  EnableServiceCleaningWorkersAmount: boolean
  EnableServiceCleaningHandOutGaranty: boolean
  EnableServiceCleaningHighPressureTerrace: boolean
  EnableServiceCleaningHighPressureTerracePrice: boolean
  EnableServiceCleaningFirePlace: boolean
  EnableServiceCleaningFirePlacePrice: boolean
  EnableServiceCleaningCarpet: boolean
  EnableServiceCleaningCarpetPrice: boolean
  EnableServiceCleaningHighPressureGarage: boolean
  EnableServiceCleaningHighPressureGaragePrice: boolean
  EnableServiceCleaningWindows: boolean
  EnableServiceCleaningWindowsPrice: boolean
  EnableServiceCleaningWindowsWithShutters: boolean
  EnableServiceCleaningWindowsWithShuttersPrice: boolean
  EnableServiceCleaningDovelhole: boolean
  EnableServiceCleaningDovelholeAmount: boolean
  EnableServiceCleaningDovelholePrice: boolean
  EnableServiceCleaningSpecial: boolean
  EnableServiceCleaningSpecialPrice: boolean
  EnableServiceCleaningComment: boolean

  //Disposal
  EnableServiceDisposal: boolean
  EnableServiceDisposalLampDemontage: boolean
  EnableServiceDisposalLampDemontageAmount: boolean
  EnableServiceDisposalLampDemontagePrice: boolean
  EnableServiceDisposalHeavyLift: boolean
  EnableServiceDisposalHeavyLiftPrice: boolean
  EnableServiceDisposalDemontage: boolean
  EnableServiceDisposalDemontagePrice: boolean
  EnableServiceDisposalFurnitureLift: boolean
  EnableServiceDisposalFurnitureLiftPrice: boolean
  EnableServiceDisposalComment: boolean

  //Pack
  EnableServicePack: boolean
  EnableServicePackOut: boolean
  EnableServicePackHeavyLift: boolean
  EnableServicePackHeavyLiftPrice: boolean
  EnableServicePackComment: boolean

  //Storage
  EnableServiceStorage: boolean
  EnableServiceStorageBore: boolean
  EnableServiceStorageBoreAmount: boolean
  EnableServiceStorageBorePrice: boolean
  EnableServiceStorageMontage: boolean
  EnableServiceStorageMontagePrice: boolean
  EnableServiceStorageDemontage: boolean
  EnableServiceStorageDemontagePrice: boolean
  EnableServiceStorageLampDemontage: boolean
  EnableServiceStorageLampDemontageAmount: boolean
  EnableServiceStorageLampDemontagePrice: boolean
  EnableServiceStorageFurnitureLift: boolean
  EnableServiceStorageFurnitureLiftPrice: boolean
  EnableServiceStorageHeavyLift: boolean
  EnableServiceStorageHeavyLiftPrice: boolean
  EnableServiceStoragePiano: boolean
  EnableServiceStoragePianoPrice: boolean
  EnableServiceStorageCompanyName: boolean
  EnableServiceStorageContactPersonFullName: boolean
  EnableServiceStorageContactPersonTel: boolean
  EnableServiceStorageContactPersonEMail: boolean
  EnableServiceStorageComment: boolean

  //Material Order
  EnableMaterialOrder: boolean
  EnableMaterialOrderDelivery: boolean
  EnableMaterialOrderRent: boolean
  EnableMaterialOrderBuy: boolean
  EnableMaterialOrderFree: boolean
  EnableMaterialOrderComment: boolean

  //Buildings
  DefaultBuildingSetting: CompanyBuildingSettingDTO
  CleaningServiceBuildingSetting: CompanyBuildingSettingDTO
  DisposalServiceBuildingSetting: CompanyBuildingSettingDTO
  MoveServiceOutBuildingSetting: CompanyBuildingSettingDTO
  MoveServiceInBuildingSetting: CompanyBuildingSettingDTO
  PackServiceBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceInBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceStorageInBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceOutBuildingSetting: CompanyBuildingSettingDTO

  ApponumbermentVisitDuration: number
  ApponumbermentMoveDuration: number
  ApponumbermentPackDuration: number
  ApponumbermentDeliveryDuration: number
  ApponumbermentStorageDuration: number
  ApponumbermentDisposalDuration: number
  ApponumbermentCleaningDuration: number
  ApponumbermentHandOverDuration: number

}

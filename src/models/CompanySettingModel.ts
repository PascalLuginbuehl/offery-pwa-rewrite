
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
DefaultServiceTimeStart: number //0 - 24 -> 8 => 08:00
  DefaultFurnitureLiftPrice: number | undefined
  DefaultPianoPrice: number | undefined
  DefaultHeavyLiftPrice: number | undefined
  DefaultCostEntry: number | undefined
  DefaultCostPerCubicInMoney: number | undefined
  DefaultPaymentMethodTextKey: string



  EnableHourPice: boolean
  EnableDefaultHourPrice: boolean
  HourlyPriceRangeJSON: number[]  //info: JsonConvert.SerializeObject(new double[]{ 80.00, 100.00, 120.00 })

  EnableCostCeiling: boolean
  EnableDefaultHasCostCeiling: boolean

  EnableFixPrice: boolean
  EnabledPaymentMethodTextKeys: string[] //info: JsonConvert.SerializeObject(new string[]{ Consts.CASH, etc. })
  EnableWorkerExpenses: boolean


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



  EnableServicePack: boolean
  EnableServicePackOut: boolean
  EnableServicePackHeavyLift: boolean
  EnableServicePackHeavyLiftPrice: boolean
  EnableServicePackComment: boolean



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



  EnableMaterialOrder: boolean
  EnableMaterialOrderDelivery: boolean
  EnableMaterialOrderRent: boolean
  EnableMaterialOrderBuy: boolean
  EnableMaterialOrderFree: boolean
  EnableMaterialOrderComment: boolean



  DefaultBuildingSetting: CompanyBuildingSettingDTO
  CleaningServiceBuildingSetting: CompanyBuildingSettingDTO
  DisposalServiceBuildingSetting: CompanyBuildingSettingDTO
  MoveServiceOutBuildingSetting: CompanyBuildingSettingDTO
  MoveServiceInBuildingSetting: CompanyBuildingSettingDTO
  PackServiceBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceInBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceStorageInBuildingSetting: CompanyBuildingSettingDTO
  StorageServiceOutBuildingSetting: CompanyBuildingSettingDTO



  VisitConfirmEmailSubjectTextKey: string
  VisitConfirmEmailBodyContentnumberroTextKey: string
  VisitConfirmEmailBodyContentOutroTextKey: string

  OfferEmailSubjectTextKey: string
  OfferEmailBodyContentnumberroTextKey: string
  OfferEmailBodyContentOutroTextKey: string



  ApponumbermentVisitDuration: number
  ApponumbermentMoveDuration: number
  ApponumbermentPackDuration: number
  ApponumbermentDeliveryDuration: number
  ApponumbermentStorageDuration: number
  ApponumbermentDisposalDuration: number
  ApponumbermentCleaningDuration: number
  ApponumbermentHandOverDuration: number

}

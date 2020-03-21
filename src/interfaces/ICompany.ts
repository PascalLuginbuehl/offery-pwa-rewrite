import { IUser } from "./IUser"
import { IProduct } from "./IProduct"

export interface IAddress {
  AddressId: number
  Street: string
  PLZ: string
  City: string
}
export interface IOfferTemplate {
  OfferTemplateId: number
  Name: string
  DocName: string
  LanguageCode: string
}
export interface IOfferTemplateCategory {
  NameTextKey: string
  OfferTemplateCategoryId: number
  OfferTemplates: IOfferTemplate[]
}

export interface ICompanySetting {
  //Default Values
  DefaultServiceTimeStart: number | null
  DefaultFurnitureLiftPrice: number | null
  DefaultPianoPrice: number | null
  DefaultHeavyLiftPrice: number | null
  DefaultCostPerCubicInMoney: number | null
  DefaultPaymentMethodTextKey: string

  //Conditiontypes Hourly/CostCeiling/Fixprice
  EnableHourPice: boolean
  EnableDefaultHourPrice: boolean
  HourlyPriceRangeJSON: number[]
  EnableCostCeiling: boolean
  EnableDefaultHasCostCeiling: boolean
  EnableFixPrice: boolean
  EnabledPaymentMethodTextKeys: string[]
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
  CleaningServiceBuildingSetting: IBuildingSetting
  DisposalServiceBuildingSetting: IBuildingSetting
  MoveServiceOutBuildingSetting: IBuildingSetting
  MoveServiceInBuildingSetting: IBuildingSetting
  PackServiceBuildingSetting: IBuildingSetting
  StorageServiceInBuildingSetting: IBuildingSetting
  StorageServiceStorageInBuildingSetting: IBuildingSetting
  StorageServiceOutBuildingSetting: IBuildingSetting

  //Email
  VisitConfirmEmailSubjectTextKey: string
  VisitConfirmEmailBodyContentIntroTextKey: string
  VisitConfirmEmailBodyContentOutroTextKey: string
  OfferEmailSubjectTextKey: string
  OfferEmailBodyContentIntroTextKey: string
  OfferEmailBodyContentOutroTextKey: string

  AppointmentVisitDuration: number
  AppointmentMoveDuration: number
  AppointmentPackDuration: number
  AppointmentDeliveryDuration: number
  AppointmentStorageDuration: number
  AppointmentDisposalDuration: number
  AppointmentCleaningDuration: number
  AppointmentHandOverDuration: number
}

export interface IBuildingSetting {
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

export interface ICarType {
  CarTypeId: number
  NameTextKey: string
}

export interface ICompany {
  CompanyId: number
  Name: string
  Email: string
  Telephone: string
  VatUID: string
  HeadQuarter: IAddress
  EmployeeUsers: IUser[]
  ShopProducts: IProduct[]
  OfferTemplateCategories: IOfferTemplateCategory[]
  ContactPerson: IUser
  Addresses: IAddress[]
  Settings: ICompanySetting
  CarTypes: ICarType[]
}

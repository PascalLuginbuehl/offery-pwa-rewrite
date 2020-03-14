import { IPostAddress, emtpyAddress, IAddress } from "./IAddress"



export interface IPostBuilding {
  Address: IPostAddress
  ElevatorId: number | null
  RoomAmount: number | null
  TotalArea: number | null
  EtageId: number | null
  StairsToEntryAmount: number | null
  MetersToParking: number | null

  // Move Building
  BuildingTypeId: number | null
  BuildingAgeId: number | null

  HasBasement: boolean
  HasAttic: boolean
  // HasGarage: boolean
  HasGarden: boolean
  HasWinterGarden: boolean

  PeopleLivingAmount: number | null


  // Move Out Building

  // Storage
  // StorageCompany: IPostStorageCompany


// Disposal
  // PeopleLivingAmount: number | null
  // BuildingTypeId: number | null
  // HasBasement: boolean
  // HasAttic: boolean
  // HasGarage: boolean
  // HasGarden: boolean
  // HasWinterGarden: boolean

  // Cleaning
  RestroomAmount: number | null
  WindowNormalAmount: number | null
  WindowHighVerticalAmount: number | null
  // HasBasement: boolean
  // HasAttic: boolean
  // HasGarden: boolean
  // HasWinterGarden: boolean
  BuildingTypeDetailId: number | null
  BalconyId: number | null
  FloorTypeId: number | null
  RollerBlindTypeId: number | null
  GarageTypeId: number | null
  PollutionDegreeId: number | null
  BuiltInWardrobeRangeId: number | null

  HadSmoked: boolean
  HasMoldAtWindow: boolean
  HasMoldAtWall: boolean
  HasHardenedDirt: boolean
  HadPets: boolean

  Comment: string

  // BuildingTypeId: number | null


  // Address: IPostAddress
  // RoomAmount: number | null
  // TotalArea: number | null

  // Comment: string
}

// Other
export interface IBuilding extends IPostBuilding {
  BuildingId: number
  CompanyId: number
  LeadId: number
  Address: IAddress
  // StorageCompany: IStorageCompany
}


export const emptyBuilding: IPostBuilding = {
  BuildingAgeId: null,
  PeopleLivingAmount: null,

  EtageId: null,
  ElevatorId: null,
  Comment: "",

  RoomAmount: null,
  TotalArea: null,
  StairsToEntryAmount: null,
  MetersToParking: null,


  Address: { ...emtpyAddress },

  RestroomAmount: null,
  WindowNormalAmount: null,
  WindowHighVerticalAmount: null,

  HasBasement: false,
  HasAttic: false,
  HasGarden: false,
  HasWinterGarden: false,
  HadSmoked: false,
  HasMoldAtWindow: false,
  HasMoldAtWall: false,
  HasHardenedDirt: false,
  HadPets: false,

  BuildingTypeId: null,
  BuildingTypeDetailId: null,
  BalconyId: null,
  FloorTypeId: null,
  RollerBlindTypeId: null,
  GarageTypeId: null,
  PollutionDegreeId: null,
  BuiltInWardrobeRangeId: null,
}






import { IPostAddress, emtpyAddress, IAddress } from './IAddress';
import { IStorageCompany, emptyStorageCompany, IPostStorageCompany } from './IStorageCompany';
import { Omit } from 'react-router';

export interface BaseBuilding {
  Address: IPostAddress
  ElevatorId: number | null
  RoomAmount: number | null
  TotalArea: number  | null
  EtageId: number | null
  StairsToEntryAmount: number | null
  MetersToParking: number | null

  Comment: string
}

interface MoveBuildingBase extends BaseBuilding {
  BuildingTypeId: number | null
  BuildingAgeId: number | null


  HasBasement: boolean
  HasAttic: boolean
  HasGarage: boolean
  HasGarden: boolean
  HasWinterGarden: boolean
}

const emptyBuilding: BaseBuilding = {
  EtageId: null,
  ElevatorId: null,
  Comment: "",

  RoomAmount: null,
  TotalArea: null,
  StairsToEntryAmount: null,
  MetersToParking: null,

  Address: { ...emtpyAddress },
}

const emptyMoveBuildingBase: MoveBuildingBase = {
  ...emptyBuilding,

  BuildingTypeId: null,
  BuildingAgeId: null,

  HasBasement: false,
  HasAttic: false,
  HasGarage: false,
  HasGarden: false,
  HasWinterGarden: false,
}

// MoveOutBuilding
export interface IPostMoveOutBuilding extends MoveBuildingBase {
  PeopleLivingAmount: number | null
}

export interface IUpdateMoveOutBuilding extends IPostMoveOutBuilding {
  MoveOutBuildingId: number
}

export interface IMoveOutBuilding extends IUpdateMoveOutBuilding {
  CompanyId: number
  LeadId: number
  Address: IAddress
}

export const emptyMoveOutBuilding: IPostMoveOutBuilding = {
  ...emptyMoveBuildingBase,

  PeopleLivingAmount: null,
}

// Move In building
export interface IPostMoveInBuilding extends MoveBuildingBase {

}

export interface IUpdateMoveInBuilding extends IPostMoveInBuilding {
  MoveInBuildingId: number
}

export interface IMoveInBuilding extends IUpdateMoveInBuilding {
  CompanyId: number
  LeadId: number
  Address: IAddress
}

export const emptyMoveInBuilding: IPostMoveInBuilding = emptyMoveBuildingBase

// Storage Building
export interface IPostStorageBuilding extends BaseBuilding {
  StorageCompany: IPostStorageCompany
}

export interface IUpdateStorageBuilding extends IPostStorageBuilding {
  StorageBuildingId: number
}

export interface IStorageBuilding extends IUpdateStorageBuilding {
  CompanyId: number
  LeadId: number
  Address: IAddress
  StorageCompany: IStorageCompany
}

export const emptyStorageBuilding: IPostStorageBuilding = {
  ...emptyBuilding,
  StorageCompany: emptyStorageCompany,
}


// Disposal
export interface IPostDisposalOutBuilding extends BaseBuilding {
  PeopleLivingAmount: number | null
  BuildingTypeId: number | null
}

export interface IUpdateDisposalOutBuilding extends IPostDisposalOutBuilding {
  DisposalOutBuildingId: number
}

export interface IDisposalOutBuilding extends IUpdateDisposalOutBuilding {
  CompanyId: number
  LeadId: number
  Address: IAddress
}

export const emptyDisposalOutBuilding : IPostDisposalOutBuilding = {
  ...emptyBuilding,
  PeopleLivingAmount: null,
  BuildingTypeId: null,
}

//Cleaning
export interface IPostCleaningBuilding {
  RestroomAmount: number | null
  WindowNormalAmount: number | null
  WindowHightVerticalAmount: number | null
  HasBasement: boolean
  HasAttic: boolean
  HasGarden: boolean
  HasWinterGarden: boolean
  HasSmoked: boolean
  HasMoldAtWindow: boolean
  HasMoldAtWall: boolean
  HasHardenedDirt: boolean
  HadPets: boolean
  BuildingTypeId: number | null
  BuildingTypeDetailId: number | null
  BalconyId: number | null
  FloorTypeId: number | null
  RollerBlindTypeId: number | null
  GarageTypeId: number | null
  PollutionDegreeId: number | null
  BuiltinWardrobeRangeId: number | null

  Address: IPostAddress
  RoomAmount: number | null
  TotalArea: number | null

  Comment: string
}

export interface IUpdateCleaningBuilding extends IPostCleaningBuilding {
  CleaningBuildingId: number
}

export interface ICleaningBuilding extends IUpdateCleaningBuilding {
  LeadId: number
  CompanyId: number
  Address: IAddress
}

export const emptyCleaningBuilding: IPostCleaningBuilding ={
  TotalArea: null,
  RoomAmount: null,

  Comment: "",
  Address: { ...emtpyAddress },

  RestroomAmount: null,
  WindowNormalAmount: null,
  WindowHightVerticalAmount: null,

  HasBasement: false,
  HasAttic: false,
  HasGarden: false,
  HasWinterGarden: false,
  HasSmoked: false,
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
  BuiltinWardrobeRangeId: null,
}

import { IPostAddress, emtpyAddress, IAddress } from './IAddress';
import { IStorageCompany, emptyStorageCompany, IPostStorageCompany } from './IStorageCompany';
import { Omit } from 'react-router';

export interface BaseBuilding {
  Address: IPostAddress
  ElevatorId: number
  RoomAmount: number
  TotalArea: number
  EtageId: number
  StairsToEntryAmount: number
  MetersToParking: number

  Comment: string
}

interface MoveBuildingBase extends BaseBuilding {
  BuildingTypeId: number
  BuildingAgeId: number


  HasBasement: boolean
  HasAttic: boolean
  HasGarage: boolean
  HasGarden: boolean
  HasWinterGarden: boolean
}

const emptyBuilding: BaseBuilding = {
  EtageId: 1,
  ElevatorId: 1,
  Comment: "",

  RoomAmount: 0,
  TotalArea: 0,
  StairsToEntryAmount: 0,
  MetersToParking: 0,

  Address: { ...emtpyAddress },
}

const emptyMoveBuildingBase: MoveBuildingBase = {
  ...emptyBuilding,

  BuildingTypeId: 1,
  BuildingAgeId: 1,

  HasBasement: false,
  HasAttic: false,
  HasGarage: false,
  HasGarden: false,
  HasWinterGarden: false,
}

// MoveOutBuilding
export interface IPostMoveOutBuilding extends MoveBuildingBase {
  PeopleLivingAmount: number
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

  PeopleLivingAmount: 4,
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
  PeopleLivingAmount: number
  BuildingTypeId: number
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
  PeopleLivingAmount: 0,
  BuildingTypeId: 0,
}

//Cleaning
export interface IPostCleaningBuilding {
  RestroomAmount: number
  WindowNormalAmount: number
  WindowHightVerticalAmount: number
  HasBasement: boolean
  HasAttic: boolean
  HasGarden: boolean
  HasWinterGarden: boolean
  HasSmoked: boolean
  HasMoldAtWindow: boolean
  HasMoldAtWall: boolean
  HasHardenedDirt: boolean
  HadPets: boolean
  BuildingTypeId: number
  BuildingTypeDetailId: number
  BalconyId: number
  FloorTypeId: number
  RollerBlindTypeId: number
  GarageTypeId: number
  PollutionDegreeId: number
  BuiltinWardrobeRangeId: number

  Address: IPostAddress
  RoomAmount: number
  TotalArea: number

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
  ...emptyBuilding,
  RestroomAmount: 0,
  WindowNormalAmount: 0,
  WindowHightVerticalAmount: 0,

  HasBasement: false,
  HasAttic: false,
  HasGarden: false,
  HasWinterGarden: false,
  HasSmoked: false,
  HasMoldAtWindow: false,
  HasMoldAtWall: false,
  HasHardenedDirt: false,
  HadPets: false,

  BuildingTypeId: 1,
  BuildingTypeDetailId: 1,
  BalconyId: 1,
  FloorTypeId: 1,
  RollerBlindTypeId: 1,
  GarageTypeId: 1,
  PollutionDegreeId: 1,
  BuiltinWardrobeRangeId: 1,
}

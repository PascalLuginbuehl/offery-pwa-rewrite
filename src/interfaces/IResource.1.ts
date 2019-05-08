import { ICompany } from "./ICompany"
import { IText } from "./IText"
import { IUser } from "./IUser"

export interface IBuildingAge {
  BuildingAgeId: number
  OrderNumber: number
  NameTextKey: string
}

export interface IMasterThing {
  OrderNumber: number
  NameTextKey: string
}

export interface IElevator extends IMasterThing {
  ElevatorId: number
}

export interface IEtage extends IMasterThing {
  EtageId: number
}

export interface IBuildingType extends IMasterThing {
  BuildingTypeId: number
}

export interface IPollutionDegree extends IMasterThing {
  PollutionDegreeId: number
}

export interface IGarageType extends IMasterThing {
  GarageTypeId: number
}
export interface IRollerBlindType extends IMasterThing {
  RollerBlindTypeId: number
}
export interface IBalcony extends IMasterThing {
  BalconyId: number
}
export interface IFloorType extends IMasterThing {
  FloorTypeId: number
}
export interface IBuiltInWardrobeRange extends IMasterThing {
  BuiltInWardrobeRangeId: number
}
export interface IBuildingTypeDetail extends IMasterThing {
  BuildingTypeDetailId: number
}

export interface IResource {
  CurrentUser: IUser
  CurrentCompanies: ICompany[]
  Texts: IText[]
  BuildingAges: IBuildingAge[]
  Elevators: IElevator[]
  Etages: IEtage[]
  BuildingTypes: IBuildingType[]
  PollutionDegrees: IPollutionDegree[]
  GarageTypes: IGarageType[]
  RollerBlindTypes: IRollerBlindType[]
  Balconies: IBalcony[]
  FloorTypes: IFloorType[]
  BuiltInWardrobeRanges: IBuiltInWardrobeRange[]
  BuildingTypeDetails: IBuildingTypeDetail[]
}

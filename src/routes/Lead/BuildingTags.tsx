import React from "react"
import { ICleaningService, IDisposalSerivce, IMoveService, IPackSerivce, IStorageSerivce } from "../../interfaces/IService";
import { IBuilding } from "../../interfaces/IBuilding";
import { Chip } from "@material-ui/core";
import { useIntl } from "react-intl";


interface Props {
  building: IBuilding
  services: {
    cleaningService:  ICleaningService | null
    disposalService: IDisposalSerivce | null
    moveService: IMoveService | null
    packService: IPackSerivce | null
    storageService: IStorageSerivce | null
  }
}

export function BuildingTags({building, services: {cleaningService, storageService, packService, moveService, disposalService}}: Props) {
  const BuildingId = building.BuildingId

  const {formatMessage} = useIntl()

  const buildings = []

  if (cleaningService && cleaningService.BuildingId === BuildingId) {
    buildings.push("CLEANING_BUILDING")
  }

  if (disposalService && disposalService.BuildingId === BuildingId) {
    buildings.push("DISPOSAL_BUILDING")
  }

  if (packService && packService.BuildingId === BuildingId) {
    buildings.push("PACK_BUILDING")
  }

  if (moveService) {
    if (moveService.InBuildingId === BuildingId) {
      buildings.push("MOVE_IN_BUILDING")
    }

    if (moveService.OutBuildingId === BuildingId) {
      buildings.push("MOVE_OUT_BUILDING")
    }
  }

  if (storageService) {
    if (storageService.InBuildingId === BuildingId) {
      buildings.push("MOVE_IN_BUILDING")
    }

    if (storageService.StorageInBuildingId === BuildingId) {
      buildings.push("STORAGE_BUILDING")
    }

    if (storageService.OutBuildingId === BuildingId) {
      buildings.push("MOVE_OUT_BUILDING")
    }
  }

  return (<>
    {buildings.map((name, index) => <Chip
    size="small"
      key={index}
      label={formatMessage({id: name})}
    />)}
  </>)
}

import { ILead } from "../../../interfaces/ILead"
import { IServices } from "../../../interfaces/IService"

export default (lead: ILead, services: IServices) => {

  const { HasMoveInBuilding, HasMoveOutBuilding, HasDisposalOutBuilding, HasStorageInBuilding, HasCleaningBuilding } = lead
  const {HasCleaningServiceEnabled, HasDisposalServiceEnabled, HasPackServiceEnabled, HasStorageServiceEnabled, HasMoveServiceEnabled} = services

  return [
    { name: "/building", active: true },
    { name: "/building/move-out", active: HasMoveOutBuilding },
    { name: "/building/move-in", active: HasMoveInBuilding },
    { name: "/building/storage", active: HasStorageInBuilding },
    { name: "/building/disposal", active: HasDisposalOutBuilding },
    { name: "/building/cleaning", active: HasCleaningBuilding },
    { name: "/building/email-confirmation", active: true },
    { name: "/services", active: true },
    { name: "/services/move", active: HasMoveServiceEnabled },
    { name: "/services/move/material-shop", active: HasMoveServiceEnabled },
    { name: "/services/move/inventory", active: HasMoveServiceEnabled },
    { name: "/services/pack", active: HasPackServiceEnabled },
    { name: "/services/pack/material-shop", active: HasPackServiceEnabled },
    { name: "/services/storage", active: HasStorageServiceEnabled },
    { name: "/services/storage/material-shop", active: HasStorageServiceEnabled },
    { name: "/services/storage/inventory", active: HasStorageServiceEnabled },
    { name: "/services/disposal", active: HasDisposalServiceEnabled },
    { name: "/services/disposal/inventory", active: HasDisposalServiceEnabled },
    { name: "/services/cleaning", active: HasCleaningServiceEnabled },
    { name: "/conditions/move", active: HasMoveServiceEnabled },
    { name: "/conditions/pack", active: HasPackServiceEnabled },
    { name: "/conditions/storage", active: HasStorageServiceEnabled },
    { name: "/conditions/disposal", active: HasDisposalServiceEnabled },
    { name: "/conditions/cleaning", active: HasCleaningServiceEnabled },
    { name: "/offer/generate", active: true },
    { name: "/offer/preview", active: true },
    { name: "/offer/send", active: true },
    { name: "/offer/done", active: true },
  ]
}

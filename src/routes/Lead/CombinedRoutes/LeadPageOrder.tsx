import { ILeadContainer } from "../LeadAPI"

export default function LeadPageOrder(container: ILeadContainer) {

  const { buildings, Lead: { Services } } = container

  const { HasCleaningServiceEnabled, HasDisposalServiceEnabled, HasPackServiceEnabled, HasStorageServiceEnabled, HasMoveServiceEnabled } = Services

  return [
    { name: "/customer", active: true },
    { name: "/building/new", active: (buildings == null || buildings.length <= 0) },
    { name: "/building", active: true },

    { name: "/building/email-confirmation", active: true },
    { name: "/services", active: true },
    { name: "/services/move", active: HasMoveServiceEnabled },
    { name: "/services/move/inventory", active: HasMoveServiceEnabled },
    { name: "/services/pack", active: HasPackServiceEnabled },
    { name: "/services/storage", active: HasStorageServiceEnabled },
    { name: "/services/storage/inventory", active: HasStorageServiceEnabled },
    { name: "/services/disposal", active: HasDisposalServiceEnabled },
    { name: "/services/disposal/inventory", active: HasDisposalServiceEnabled },
    { name: "/services/cleaning", active: HasCleaningServiceEnabled },
    { name: "/services/material-shop", active: true },
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

export interface IOFile {
  OFileId: number
  Created: Date
  DocName: string
  FileExtension: string
  FileFormat: number
  MediaTypeHeaderValue: string
}

export interface IOffer {
  OfferId: number
  Created: string
  FromTemplate: string
  Language: string
  Files: IOFile[]
}

export interface IConfirmOffer {
  LeadId: number
  OfferId: number

  ConfirmedOrderVerbal: boolean
  ConfirmedOrder: boolean | null

  Comment: string
}

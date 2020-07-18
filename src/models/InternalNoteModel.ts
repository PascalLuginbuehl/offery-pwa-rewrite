
export interface RegisterInternalNoteModel {
  Note: string
}

export interface InternalNoteModel {
  InternalNoteId: number
  Note: string
  UserId: number
  UserFirstName: string
  UserLastName: string

  CreatedDate: Date
  ChangedDate: Date
}

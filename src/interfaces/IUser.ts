export interface ISettings {
  UserSettingId: number
  PrefferedLanguage: string
  LastMailedPerson: string
  HasAccessToOffery: boolean
  IsSuperAdmin: boolean
}

export interface IUser {
  Id: string
  PhoneNumber: string
  Email: string
  Settings: ISettings
}


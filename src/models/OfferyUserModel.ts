
export interface UserSettingModel {
  UserSettingId: number
  PrefferedLanguage: string
  LastMailedPerson: string
  HasAccessToOffery: boolean
  IsSuperAdmin: boolean
}

export interface OfferyUserModel {
  Id: number
  Email: string
  PhoneNumber: string
  FirstName: string
  LastName: string

  Settings: UserSettingModel
}

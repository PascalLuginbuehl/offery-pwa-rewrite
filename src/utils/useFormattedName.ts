interface NameObject {
  Firstname: string
  Lastname: string
}

export default function useFormattedName() {
  return function FormatName(name: NameObject): string {
    return `${name.Firstname} ${name.Lastname}`
  }
}

interface NameObject {
  Company?: string
  FirstName: string
  LastName: string
}

export default function useFormattedName() {
  return function FormatName(name: NameObject): string {
    if (name.Company) {
      return `${name.Company}, ${name.FirstName} ${name.LastName}`

    }
    return `${name.FirstName} ${name.LastName}`
  }
}

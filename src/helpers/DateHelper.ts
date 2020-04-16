export default class DateHelper {
  static parseDate(dateString: string | null): Date | null {
    if (!dateString)
      return null

    const b = dateString.split(/\D/)
    return new Date(parseInt(b[0]), parseInt(b[1])-1, parseInt(b[2]), parseInt(b[3]), parseInt(b[4]), parseInt(b[5]))
  }

  static parseDateNotNull(dateString: string): Date {
    return this.parseDate(dateString) || new Date()
  }
}

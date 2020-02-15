/// <reference types="react-scripts" />


declare module "material-ui-phone-number" {
  import * as React from "react"
import { TextFieldProps } from "@material-ui/core/TextField"

  interface MuiPhoneNumberProps extends TextFieldProps {
    excludeCountries?: Array<string>
    onlyCountries?: Array<string>
    preferredCountries?: Array<string>
    defaultCountry?: string
    inputClass?: string
    dropdownClass?: string
    autoFormat?: boolean
    disableAreaCodes?: boolean
    disableCountryCode?: boolean
    disableDropdown?: boolean
    enableLongNumbers?: boolean
    countryCodeEditable?: boolean
  }

  declare class MuiPhoneNumber extends React.Component<MuiPhoneNumberProps, any> { }
  export default MuiPhoneNumber
}

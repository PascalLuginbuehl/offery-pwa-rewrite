import * as React from 'react'
import { IPostAddress } from '../../../interfaces/IAddress'
import ValidatedTextField from '../../Validator/ValidatedTextField';


interface State extends IPostAddress {

}

interface Props {
  value: IPostAddress
  onChange: (target: string, value: any) => void
  name: string
}

class AddressField extends React.Component<Props, State> {

  private handleChange = (target: string, value: string) => {
    this.props.onChange(this.props.name, Object.assign({}, this.props.value, { [target]: value }))
  }

  public render() {
    const { City, PLZ, Street } = this.props.value

    return (
      <>
        <ValidatedTextField
          label="STREET"
          name="Street"
          value={Street}
          onChange={this.handleChange}
        />
        <ValidatedTextField
          label="CITY"
          value={City}
          name="City"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="ZIP_CODE"
          value={PLZ}
          name="PLZ"
          onChange={this.handleChange}

        />
      </>
    )
  }
}

export default AddressField

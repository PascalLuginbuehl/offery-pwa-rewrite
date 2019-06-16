import * as React from 'react'
import { IPostAddress } from '../../../interfaces/IAddress'
import ValidatedTextField from '../../Validator/ValidatedTextField';


interface State extends IPostAddress {

}

interface Props {
  value: IPostAddress
  onChange: (value: any, target: string) => void
  name: string
}

class AddressField extends React.Component<Props, State> {

  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.value, { [target]: value }), this.props.name)
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

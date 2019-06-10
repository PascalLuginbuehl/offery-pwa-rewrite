import { IPostCustomer } from '../../../interfaces/ILead'
import * as React from 'react'
import ValidatedTextField from '../../Validator/ValidatedTextField';

interface State {

}

interface Props {
  customer: IPostCustomer
  onChange: (target: any, value: any) => void
  name: string
}

class CustomerField extends React.Component<Props, State> {

  private handleChange = (value: string, target: string) =>{
    this.props.onChange(Object.assign({}, this.props.customer, { [target]: value }), this.props.name)
  }

  public render() {
    const { Firstname, Lastname, CompanyName, Email, TelephoneNumber, PrefferedLanguage, IsMale } = this.props.customer

    return (
      <>
        <ValidatedTextField
          label="LASTNAME"
          name="Lastname"
          value={Lastname}
          onChange={this.handleChange}

          required
        />

        <ValidatedTextField
          label="FIRSTNAME"
          value={Firstname}
          name="Firstname"
          onChange={this.handleChange}

          required
        />

        {/* <Switch
          fullGrid
          label="GENDER"
          value={IsMale}
          name="IsMale"
          onChange={this.handleChange}
        /> */}

        {/* <Dropdown label="LANGUAGE" value={PrefferedLanguage} name="PrefferedLanguage" onChange={this.handleChange} options={[{ label: "GERMAN", value: "DE" }, { label: "FRENCH", value: "FR" }, { label: "ITALIAN", value: "IT"}, {label: "ENGLISH", value: "EN"}]} /> */}

        <ValidatedTextField
          label="COMPANY"
          value={CompanyName}
          name="CompanyName"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="EMAIL"
          value={Email}
          name="Email"
          onChange={this.handleChange}

          required
          email
        />

        <ValidatedTextField
          label="PHONE"
          value={TelephoneNumber}
          name="TelephoneNumber"
          onChange={this.handleChange}

          required
        />
      </>
    )
  }
}

export default CustomerField

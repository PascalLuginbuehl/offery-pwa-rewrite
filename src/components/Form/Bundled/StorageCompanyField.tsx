import * as React from 'react'
import { IPostStorageCompany } from '../../../interfaces/IStorageCompany';
import ValidatedTextField from '../../Validator/ValidatedTextField';


interface State extends IPostStorageCompany {

}

interface Props {
  value: IPostStorageCompany
  onChange: (value: any, target: string) => void
  name: string
}

class StorageCompanyField extends React.Component<Props, State> {

  private handleChange = (value: string, target: string) => {
    this.props.onChange(Object.assign({}, this.props.value, { [target]: value }), this.props.name)
  }
  public render() {
    // const { classes, value, onClick } = this.props
    const { CompanyName, ContactPersonEMail, ContactPersonFullName, ContactPersonTel } = this.props.value

    return (
      <>
        <ValidatedTextField
          label="FULL_NAME"
          value={ContactPersonFullName}
          name="ContactPersonFullName"
          onChange={this.handleChange}

          required
        />

        <ValidatedTextField
          label="COMPANY"
          value={CompanyName}
          name="CompanyName"
          onChange={this.handleChange}
        />

        <ValidatedTextField
          label="CONTACTPERSON_EMAIL"
          value={ContactPersonEMail}
          name="ContactPersonEMail"
          onChange={this.handleChange}

          required
          email
        />

        <ValidatedTextField
          label="CONTACT_PERSON_TEL"
          value={ContactPersonTel}
          name="ContactPersonTel"
          onChange={this.handleChange}

          required
        />
      </>
    )
  }
}

export default StorageCompanyField

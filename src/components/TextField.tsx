import DefaultTextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Omit } from 'react-router';


interface Props extends InjectedIntlProps, Omit<StandardTextFieldProps, "onChange">  {
  onChange: (value: any, target: any) => void
  defaultValue?: string
  className?: string
  label: string
  name: string

  noGrid?: boolean
}


class TextField extends React.Component<Props> {

  private newOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.props.onChange(event.target.name, event.target.value)
  }

  public render() {
    const {  label, intl, value, name } = this.props
    // removing noGrid property
    const { noGrid = false, ...props } = this.props

    return (
      <DefaultTextField
        {...props}

        id={label}
        value={value}
        onChange={this.newOnChange}
        label={intl.formatMessage({ id: label })}
        name={name}
      />
    )
  }
}

export default injectIntl(TextField)

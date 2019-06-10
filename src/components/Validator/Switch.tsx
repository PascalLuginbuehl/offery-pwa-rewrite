import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Switch as OriginalSwitch, FormControlLabel, Grid, Omit } from '@material-ui/core'
import { SwitchProps } from '@material-ui/core/Switch'

interface Props extends InjectedIntlProps, Omit<SwitchProps, "onChange"> {
  onChange: (target: string, value: any) => void
  label: string
  name: string
  value: boolean


  noGrid?: boolean
  fullGrid?: boolean
  validators?: Array<"matchRegexp" | "isEmail" | "isEmpty" | "required" | "trim" | "isNumber" | "isFloat" | "isPositive" | "minNumber" | "maxNumber" | "minFloat" | "maxFloat" | "minStringLength" | "maxStringLength" | "isString" | string>
}

class Switch extends React.Component<Props> {

  private newOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, checked: boolean) => {
    this.props.onChange(event.target.name, checked)
  }

  public render() {
    // removing noGrid property
    const { label, intl, value, name, noGrid = false, validators, fullGrid, ...props } = this.props

    const Field = (
      <FormControlLabel
        control={
          <OriginalSwitch
            {...props}
            id={label}

            checked={value}
            onChange={this.newOnChange}
            value={name}
            color="primary"
            name={name}
          />
        }
        label={intl.formatMessage({ id: label })}
      />
    )

    if (noGrid) {
      return Field
    } else if(fullGrid) {
      return (
        <Grid item xs={12} sm={6}>
          {Field}
        </Grid>
      )
    } else {
      return (
        <Grid item xs={6} sm={4} md={3} >
          {Field}
        </Grid>
      )
    }
  }
}

export default injectIntl(Switch)

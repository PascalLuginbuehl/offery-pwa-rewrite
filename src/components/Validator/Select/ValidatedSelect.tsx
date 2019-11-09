import { DatePicker as DatePickerOriginal, DatePickerProps } from "@material-ui/pickers"
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Grid, WithStyles, withStyles } from "@material-ui/core"
// import { injectIntl } from "react-intl"
import { WithFormContext, withValidator } from '..';
import { Omit } from 'react-router';
import Validations from "../Validations";
import { components, styles } from '../../ReactSelectComponents'
import Select from 'react-select'
import { ValueType } from "react-select/src/types"

// Custom validation to export without ProviderProps
export interface ValidatedSelectProps extends Omit<DatePickerProps, "onChange"> {
  onChange: (value: any, target: any) => void
  label: string

  noGrid?: boolean
  required?: boolean

  // Custom thing
  options: Array<{ value: number, label: string}>
  value: number | any[] | null

  isMulti?: boolean

  notTranslatedLabel?: boolean

  // toOptions: (option: any) => { value: string, label: string }
  // toValue: (value: { value: any }) => any
}


interface Props extends InjectedIntlProps, WithFormContext, WithStyles<typeof styles>, ValidatedSelectProps {

}

interface State {
  errorMessage: string | null
  dirty: boolean
}

interface DataParsing {
  label: string
  value: string
}

class ValidatedSelect extends React.Component<Props, State> {
  state: State = {
    errorMessage: null,
    dirty: false,
  }

  getErrors(): string | false {
    const { value, required, isMulti } = this.props

    if (required && !value) {
      return "REQUIRED_SELECT"
    }

    if (required && isMulti && Array.isArray(value) && value.length == 0) {
      return "REQUIRED_SELECT_ONE"
    }

    return false
  }

  validate = (validateAnyway = false): string | false  => {
    const result = this.getErrors()
    const { dirty } = this.state

    if (result) {
      if (validateAnyway || dirty) {
        this.setState({ errorMessage: result })
      }
    } else {
      this.setState({ errorMessage: null })
    }


    return result
  }

  componentDidMount() {
    this.props.registerField(this)
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // const { value } = this.props
    if (this.props.value !== prevProps.value) {
      // this.validateDebounced(this.props.value, this.props.withRequiredValidator);
      this.validate()
    }
  }

  handleBlur = () => {
    this.setState({ dirty: true })
    this.validate(true)
  }

  componentWillUnmount() {
    this.props.unregisterField(this)
    // this.validateDebounced.cancel();
  }

  public render() {
     // removing unused properties
    const { required = false, classes, disabled = false, isMulti = false, value, options, isValid, label, intl, noGrid = false, registerField, unregisterField, notTranslatedLabel = true, ...props } = this.props
    const { errorMessage } = this.state

    return (
      <Grid xs={12} sm={6} item>
        <Select
          classes={classes}
          // styles={selectStyles}
          components={components}

          TextFieldProps={{
            label: intl.formatMessage({ id: label }),
            InputLabelProps: {
              shrink: true,
            },
            onBlur: this.handleBlur,
            error: !!errorMessage,
            helperText: errorMessage ? intl.formatMessage({ id: errorMessage }) : null,
            disabled,
            required,
          }}
          required={required}

          // kwikfix to stay int
          // @ts-ignore
          options={options.map(e => ({...e, value: e.value.toString()}))}

          // options={options.map(toOptions).map(e => ({ ...e, label: translatedLabel ? intl.formatMessage({ id: e.label }) : label, }))}
          getOptionLabel={({ label }) => notTranslatedLabel ? intl.formatMessage({ id: label }) : label}
          getOptionValue={({ value }) => value}

          //@ts-ignore
          value={options.filter(({ value: valueId }) => valueId === value)}
          // value={value ? isMulti ? value.map(toOptions) : toOptions(value) : null}
          isMulti={isMulti}
          placeholder={intl.formatMessage({id: "SELECT"})}

          onChange={this.selectOnChange}

          isDisabled={disabled}

          id={label}
        />
      </Grid>
    )
  }

  selectOnChange = (value: ValueType<DataParsing>) => {
    if(value){
      if(!Array.isArray(value)) {
        // @ts-ignore
        this.props.onChange(value.value, this.props.name)
      } else {
        this.props.onChange(value, this.props.name)
      }
    }
  }
}

// export default injectIntl(DatePicker)

export { ValidatedSelect }

export default withStyles(styles)(withValidator(injectIntl(ValidatedSelect)))

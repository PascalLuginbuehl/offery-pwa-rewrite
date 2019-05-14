import { DateTimePicker as DatePickerOriginal, DateTimePickerProps } from "@material-ui/pickers"
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Grid } from "@material-ui/core"
// import { injectIntl } from "react-intl"
import { WithFormContext, withValidator } from '.';
import { Omit } from 'react-router';
import Validations from "./Validations";

interface Props extends InjectedIntlProps, Omit<DateTimePickerProps, "onChange">, WithFormContext {
  onChange: (value: any, target: any) => void
  label: string

  noGrid?: boolean
  required?: boolean
}

interface State {
  errorMessage: string | null
  dirty: boolean
}

class ValidatedDateTimePickerType extends React.Component<Props, State> {
  state: State = {
    errorMessage: null,
    dirty: false,
  }


  getErrors(): string | false {
    const { value, required } = this.props

    if (required && !value) {
      return "REQUIRED"
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

  private newOnChange = (value: Date | null) => {
    this.props.onChange(value, this.props.name)
  }

  public render() {
     // removing noGrid property
    const { isValid, label, intl, noGrid = false, registerField, unregisterField, ...props } = this.props
    const { errorMessage } = this.state

    return (
      <Grid xs={12} sm={6} item>
        <DatePickerOriginal
          {...props}

          // BUgfix so it has key, check later TODO
          key={1}


          onChange={this.newOnChange}
          //@ts-ignore
          label={intl.formatMessage({ id: label })}

          // okLabel={currentLocale.messages.OK}
          // cancelLabel={currentLocale.messages.CANCEL}
          // views={["year", "month", "day"]}
          // format={"dd.MM.yyyy"}

          id={label}

          onBlur={this.handleBlur}

          error={!!errorMessage}
          helperText={errorMessage ? intl.formatMessage({ id: errorMessage }) : null}

          fullWidth
        />
      </Grid>
    )
  }
}

// export default injectIntl(DatePicker)

export { ValidatedDateTimePickerType }

export default withValidator(injectIntl(ValidatedDateTimePickerType))

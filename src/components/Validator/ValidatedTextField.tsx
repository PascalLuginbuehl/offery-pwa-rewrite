import DefaultTextField, { StandardTextFieldProps } from '@material-ui/core/TextField'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { WithFormContext, withValidator } from '.';
import Validations from './Validations';
import { Omit } from 'react-router';
import { Grid } from '@material-ui/core';


interface Props extends InjectedIntlProps, Omit<StandardTextFieldProps, "onChange">, WithFormContext {
  onChange: (value: any, target: any) => void
  defaultValue?: string
  className?: string
  label: string
  name: string

  noGrid?: boolean

  required?: boolean
  email?: boolean
  maxLength?: number
  minLength?: number
}

interface State {
  errorMessage: string | null
  dirty: boolean

  messageValues: {[key: string]: any}
}

class ValidatedTextField extends React.Component<Props, State> {
  state: State = {
    errorMessage: null,
    dirty: false,
    messageValues: {}
  }

  getErrors = (): string | false => {
    const { value, required, email, minLength, maxLength } = this.props

    if (required && !Validations.trim(value)) {
      return "REQUIRED"
    }

    if (email && !Validations.isEmail(value)) {
      return "VALID_EMAIL"
    }

    if (minLength && !Validations.minSringtringLength(value, minLength)) {
      this.setState({ messageValues: { minLength: minLength }})
      return "MIN_LENGTH"
    }

    if (maxLength && !Validations.maxStLength(value, maxLength)) {
      this.setState({ messageValues: { maxLength: maxLength}})
      return "MAX_LENGTH"
    }



    return false
  }

  validate = (validateAnyway = false): string | false => {
    const result = this.getErrors()
    const {dirty} = this.state

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
    this.setState({dirty: true})
    this.validate(true)
  }

  componentWillUnmount() {
    this.props.unregisterField(this)
    // this.validateDebounced.cancel();
  }

  private newOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    this.props.onChange(event.target.value, event.target.name)
  }

  public render() {
    // removing noGrid property
    const { isValid, email, label, intl, value, name,  noGrid = false, registerField, unregisterField, ...props } = this.props
    const { errorMessage, messageValues } = this.state


    const returnValue =  (
      <DefaultTextField
        {...props}

        id={label}
        value={value == null ? undefined : value}
        onChange={this.newOnChange}
        label={intl.formatMessage({ id: label })}
        name={name}

        onBlur={this.handleBlur}
        // Show error message here
        error={!!errorMessage}
        helperText={errorMessage ? intl.formatMessage({ id: errorMessage }, messageValues) : null}

        fullWidth
      />
    )

    if(noGrid) {
      return returnValue
    } else {
      return (<Grid xs={12} md={6} item>{returnValue}</Grid>)
    }
  }
}

export { ValidatedTextField }

export default withValidator(injectIntl(ValidatedTextField))

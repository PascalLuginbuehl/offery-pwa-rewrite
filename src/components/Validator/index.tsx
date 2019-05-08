import * as React from 'react'
import { ValidatedTextField } from './ValidatedTextField'
import { ValidatedDatePicker } from './ValidatedDatePicker'
import { ValidatedSelect } from './ValidatedSelect';

interface Props {
  children: any
  customValidator?: () => boolean
  // onChange: (target: string, value: any) => void
}

type ValidatedFields = ValidatedTextField | ValidatedDatePicker | ValidatedSelect

export interface FormContext {
  registerField: (element: ValidatedFields) => void
  unregisterField: (element: ValidatedFields) => void
  isValid: () => boolean
}

export const FormContext = React.createContext<FormContext | null>(null);

class Validator extends React.Component<Props> {
  public formFields: ValidatedFields[] = []

  registerField = (element: ValidatedFields) => {
    this.formFields = [...this.formFields, element]
  }

  unregisterField = (element: ValidatedFields) => {
    this.formFields = this.formFields.filter(e => e != element)
  }

  isValid = (): boolean => {
    const formFields = this.formFields
    const { customValidator } = this.props

    const validated = formFields.map(e => e.validate(true))

    console.log(formFields, validated);

    //
    if (validated.map(e => !!e).indexOf(true) === -1) {
      if (customValidator && customValidator()) {
        return false
      }

      return true
    }


    return false
  }

  public render() {
    return (
      <div>
        <FormContext.Provider value={{ registerField: this.registerField, unregisterField: this.unregisterField, isValid: this.isValid}}>
          {this.props.children}
        </FormContext.Provider>
      </div>
    )
  }
}

export interface WithFormContext extends FormContext {

}

export function withValidator<P>(Component: React.ComponentType<P & WithFormContext>) {
  function WithValidator(props: Pick<P, Exclude<keyof P, keyof WithFormContext>>) {
    return (
      <FormContext.Consumer>
        {state => state ?
        // @ts-ignore
        <Component {...props} registerField={state.registerField} unregisterField={state.unregisterField} isValid={state.isValid} /> : <div>Error Parent not found</div>}
      </FormContext.Consumer>
    )
  }

  return WithValidator
}


export default Validator

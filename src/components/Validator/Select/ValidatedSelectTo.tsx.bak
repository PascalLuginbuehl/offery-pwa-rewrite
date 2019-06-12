import * as React from 'react'
import ValidatedSelect, { ValidatedSelectProps } from './ValidatedSelect';
import { Omit } from 'yargs';


interface Props<Type> extends Omit<Omit<ValidatedSelectProps, "toOptions">, "toValue"> {
  value: Type
  keyName: keyof Type
}

interface State {

}

class ValidatedSelectTo<Type> extends React.Component<Props<Type>, State> {
  state: State = {

  }

  toOptions<T>(keyName: keyof T) {
    return (option: any) => ({ label: option.NameTextKey, value: option[keyName] })
  }

  toValue<T>(keyName: keyof T) {
    return (value: any) => this.props.options.find((elevator: any) => value.value == elevator[keyName])
  }

  public render() {
    const { keyName, ...props} = this.props

    return <ValidatedSelect {...props} toOptions={this.toOptions<Type>(keyName)} toValue={this.toValue<Type>(keyName)} />
  }
}

export default ValidatedSelectTo

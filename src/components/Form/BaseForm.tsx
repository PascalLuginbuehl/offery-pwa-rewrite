
import * as React from 'react'
import { RouteComponentProps } from 'react-router';

export interface BaseFormState<Master> {
  initialAwait: Promise<Master | null> | null
  saveAwait: Promise<void> | null
}

export interface BaseFormProps<Master> extends RouteComponentProps {
  data: Master
  onChange: (data: Master) => void
  // get: () => Promise<Master>
  // save: (data: Master) => Promise<void>
  nextPage: string
}

class BaseForm<Props extends BaseFormProps<Master>, State extends BaseFormState<Master> & Master, Master> extends React.Component<Props, State> {
  constructor(props: Props, initial: Master) {
    super(props)


    // @ts-ignore
    this.state = {
      initialAwait: null,
      saveAwait: null,
      ...initial
    }
  }

  protected handleChange = (target: keyof Master, value: any) => {
    const { data, onChange } = this.props

    const data2 = {
      [target]: value,
      ...data,
    }

    // @ts-ignore
    onChange(data2)
  }
}

export default BaseForm

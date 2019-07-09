import { RouteComponentProps } from "react-router";
import { Component } from "react";

interface localProps extends RouteComponentProps {
  nextPage?: string
  save: () => Promise<any>
}

export default class FormTemplate<Props, State> extends Component<Props & localProps, State> {
  saveFunction = () => {
    const { nextPage, save, history } = this.props
    const savePromise = save()

    if(nextPage) {
      savePromise.then(() => {
        history.push(nextPage)
      })
    }

    return savePromise
  }
}

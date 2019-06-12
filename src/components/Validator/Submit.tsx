import * as React from 'react'
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl'
import { WithFormContext, withValidator } from '.'
import { Button, Grid } from '@material-ui/core'
import Loading from '../Loading'


interface Props extends InjectedIntlProps, WithFormContext {
  onSubmit: () => Promise<any>
  label?: string
}
interface State {
  saveAwait: Promise<any> | null
}
class Submit extends React.Component<Props, State> {
  state: State = {
    saveAwait: null
  }

  handleSubmit = () => {
    const { isValid } = this.props
    const { onSubmit } = this.props



    console.log(isValid())
    if (isValid()) {
      this.setState({saveAwait: onSubmit()})
    }
  }

  public render() {
    const { saveAwait } = this.state
    // remove properties from object
    const { label="SUBMIT_FORM", children, intl, isValid, onSubmit, registerField, unregisterField, ...props } = this.props

    return (
      <Grid item xs={12} sm={6}>
        <Loading await={saveAwait} disableCenter>
          <Button variant="contained" color="primary" type="submit" onClick={this.handleSubmit} {...props}>
            <FormattedMessage id={label} />
          </Button>
        </Loading>
      </Grid>
    )
  }
}

export default withValidator(injectIntl(Submit))

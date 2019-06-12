import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

interface Props extends TooltipProps, InjectedIntlProps {

}

class IntlTooltip extends React.Component<Props> {
  public render() {
    const { intl, title, ...props } = this.props

    return (
      //@ts-ignore
      <Tooltip {...props} title={intl.formatMessage({ id: title })} aria-label={intl.formatMessage({ id: title })} />
    )
  }
}

export default injectIntl(IntlTooltip)

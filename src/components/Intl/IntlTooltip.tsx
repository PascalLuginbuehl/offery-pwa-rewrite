import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip"
import * as React from "react"
import { WrappedComponentProps, injectIntl } from "react-intl"

interface Props extends TooltipProps, WrappedComponentProps {
  title: string
}

class IntlTooltip extends React.Component<Props> {
  public render() {
    const { intl, title, ...props } = this.props

    return (
      <Tooltip {...props} title={intl.formatMessage({ id: title })} aria-label={intl.formatMessage({ id: title })} />
    )
  }
}

export default injectIntl(IntlTooltip)

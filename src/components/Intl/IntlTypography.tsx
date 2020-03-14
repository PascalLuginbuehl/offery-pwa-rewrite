import TypographyOriginal, { TypographyProps } from "@material-ui/core/Typography"
import * as React from "react"
import { WrappedComponentProps, injectIntl } from "react-intl"

interface Props extends TypographyProps, WrappedComponentProps {
  children: string
}

class Typography extends React.Component<Props> {
  public render() {
    const { intl, ...props } = this.props

    return (
      <TypographyOriginal {...props}>{intl.formatMessage({ id: this.props.children })}</TypographyOriginal>
    )
  }
}


export default injectIntl(Typography)

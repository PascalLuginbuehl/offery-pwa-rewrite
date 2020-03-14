import * as React from "react"
import TableCell, { TableCellProps } from "@material-ui/core/TableCell"
import { injectIntl, WrappedComponentProps } from "react-intl"

interface Props extends TableCellProps, WrappedComponentProps {
  children: string
}

class IntlTableCell extends React.Component<Props> {
  public render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { intl, children, ...props } = this.props

    return <TableCell {...props}>{intl.formatMessage({ id: children })}</TableCell>
  }
}

export default injectIntl(IntlTableCell)

import { createStyles, Theme, WithStyles, withStyles, CircularProgress, Grid } from '@material-ui/core'
import * as React from 'react'
import IntlTypography from './Intl/IntlTypography';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithStyles<typeof styles> {
  status: any
}

class HttpErrorHandler extends React.Component<Props> {
  public render() {
    const { status } = this.props

    console.log(status)
    const googleForm = "https://docs.google.com/forms/d/e/1FAIpQLSeSAFYYuETOeifVAEZJMAOejCXyNZXlBzlvdbdVjKoOMQRRsQ/viewform?usp=pp_url&"

    // if() {

    // }

    message: string,
    stackTrace: string,


    const preFilledFormValues = {
      "entry.124345133": message,
      "entry.330568924": stackTrace,
      "entry.1233024141": window.location.href,
    }

    var queryString = Object.keys(preFilledFormValues).map((key) => {
      // @ts-ignore
      return encodeURIComponent(key) + '=' + encodeURIComponent(preFilledFormValues[key])
    }).join('&')

    return <Grid item xs={12}>
        <IntlTypography>ERROR_OCCURED</IntlTypography><a href={googleForm + queryString}></a>
    </Grid>
  }
}

export default withStyles(styles)(HttpErrorHandler)

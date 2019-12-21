import { createStyles, Theme, WithStyles, withStyles, CircularProgress, Grid, Typography } from '@material-ui/core'
import * as React from 'react'
import IntlTypography from './Intl/IntlTypography';
import { FormattedMessage } from 'react-intl';

const styles = (theme: Theme) =>
  createStyles({

  })

interface Props extends WithStyles<typeof styles> {
  status: { statusText?: string; json?: { Message?: string; ModelState?: { [key: string]: any } } } | "string" | undefined
  data: { [key: string]: any } | undefined
}

class HttpErrorHandler extends React.Component<Props> {
  public render() {
    const { status, data } = this.props
    // const data = {}

    // const status = { "statusText": "Bad Request", "json": { "Message": "The request is invalid.", "ModelState": { "newLead.VisitDate": [`The VisitDate field is required.`] } } }

    const googleForm = "https://docs.google.com/forms/d/e/1FAIpQLSeSAFYYuETOeifVAEZJMAOejCXyNZXlBzlvdbdVjKoOMQRRsQ/viewform?usp=pp_url&"

    if (status) {
      let errorMessage = ""
      let stackTrace = ""

      if (typeof status === "object") {
        if (status.statusText !== undefined) {
          errorMessage = status.statusText
        }

        if (status.json !== undefined) {
          if (status.json.Message !== undefined) {
            errorMessage = status.json.Message

            if (status.json.ModelState !== undefined) {
              stackTrace = JSON.stringify(status.json.ModelState)
            }
          }

          // if (status.hasOwnProperty('message')) {
          //   errorMessage = ""
          // }
        }
      }

      if (status && typeof status === "string") {
        errorMessage = status
      }

      const preFilledFormValues = {
        "entry.124345133": errorMessage,
        "entry.330568924": stackTrace,
        "entry.1233024141": window.location.href,
        "entry.533978395": JSON.stringify(data),
      }

      const queryString = Object.keys(preFilledFormValues)
        .map(key => {
          // @ts-ignore
          return encodeURIComponent(key) + '=' + encodeURIComponent(preFilledFormValues[key])
        })
        .join("&")

      return (
        <Grid item xs={12}>
          <IntlTypography color="error">ERROR_WHILE_SAVING</IntlTypography>

          <Typography>
            <IntlTypography component="span">FILL_FOLLOWING_FORM</IntlTypography>
            &nbsp;
            <a target="_blank" href={googleForm + queryString}>
              <FormattedMessage id="FORM" />
            </a>
          </Typography>
        </Grid>
      )
    }

    return null
  }
}

export default withStyles(styles)(HttpErrorHandler)

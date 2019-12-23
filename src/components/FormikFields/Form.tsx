import * as React from "react"
import { Form as FormikForm, FormikFormProps, useFormikContext } from "formik"
import Grid from "@material-ui/core/Grid"
import withWidth, { WithWidthProps } from "@material-ui/core/withWidth"
import { withStyles, createStyles, WithStyles } from "@material-ui/styles"
import { Theme, Typography } from "@material-ui/core"
import { Prompt } from "react-router"
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl"
import HttpErrorHandler from "../HttpErrorHandler"
import Submit from "./Submit"
import IntlTypography from "../Intl/IntlTypography"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: 8,
      // [theme.breakpoints.down('xs')]: {
      //   padding: 4,
      // }
    },
  })

class ErrorBoundary extends React.Component<{ children: React.ReactNode; data: {[key: string]: any} }, { error: any; errorInfo: any }> {
  state = { error: null, errorInfo: null }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    const googleForm = "https://docs.google.com/forms/d/e/1FAIpQLSeSAFYYuETOeifVAEZJMAOejCXyNZXlBzlvdbdVjKoOMQRRsQ/viewform?usp=pp_url&"
    const { data } = this.props

    if (this.state.errorInfo) {
      const errorMessage = this.state.error
      // @ts-ignore
      const stackTrace = this.state.errorInfo.componentStack

      const preFilledFormValues = {
        "entry.124345133": errorMessage,
        "entry.330568924": stackTrace,
        "entry.1233024141": window.location.href,
        "entry.533978395": JSON.stringify(data),
      }

      const queryString = Object.keys(preFilledFormValues)
        .map(key => {
          // @ts-ignore
          return encodeURIComponent(key) + "=" + encodeURIComponent(preFilledFormValues[key])
        })
        .join("&")

      return (
        <Grid item xs={12}>
          <IntlTypography color="error">Something went wrong.</IntlTypography>

          <Typography>
            <IntlTypography component="span">FILL_FOLLOWING_FORM</IntlTypography>
            &nbsp;
            <a target="_blank" rel="noopener noreferrer" href={googleForm + queryString}>
              <FormattedMessage id="FORM" />
            </a>
          </Typography>

          <details style={{ whiteSpace: "pre-wrap" }}>
            {/*
            //@ts-ignore */}
            {this.state.error && this.state.error.toString()}
            <br />
            {/*
            //@ts-ignore */}
            {this.state.errorInfo.componentStack}
          </details>
        </Grid>
      )
    }

    return this.props.children
  }
}

interface Props extends FormikFormProps, WithWidthProps, WithStyles<typeof styles>, InjectedIntlProps {}

const Form: React.ComponentType<Props> = ({ classes, intl, width, children }: Props) => {
  const { dirty } = useFormikContext()

  const handleUnload = (e: BeforeUnloadEvent) => {
    if (dirty) {
      // Cancel the event
      e.preventDefault()

      // Chrome requires returnValue to be set
      e.returnValue = intl.formatMessage({ id: "UNSAVED_CHANGES_CONTINUE" })
    }
  }

  React.useEffect(() => {
    window.addEventListener("beforeunload", handleUnload)

    return () => window.removeEventListener("beforeunload", handleUnload)
  })

  const { values, status, isSubmitting } = useFormikContext()

  return (
    <ErrorBoundary data={values}>
      <FormikForm>
        {/* <Prompt when={dirty} message={() => intl.formatMessage({ id: "UNSAVED_CHANGES_CONTINUE" })} /> */}

        <Grid container spacing={width == "xs" ? 1 : 2} className={classes.root}>
          {children}

          <HttpErrorHandler status={status} data={values} />

          <Submit isSubmitting={isSubmitting}></Submit>
        </Grid>
      </FormikForm>
    </ErrorBoundary>
  )
}

export default injectIntl(withStyles(styles)(withWidth()(Form)))

import * as React from "react"
import { Form as FormikForm, FormikFormProps, useFormikContext } from "formik"
import Grid from "@material-ui/core/Grid"

import {  Typography } from "@material-ui/core"
import { Prompt } from "react-router"
import { injectIntl, WrappedComponentProps, FormattedMessage } from "react-intl"
import HttpErrorHandler from "../HttpErrorHandler"
import Submit from "./Submit"
import IntlTypography from "../Intl/IntlTypography"
import GridContainer from "../GridContainer"

class ErrorBoundary extends React.Component<{ children: React.ReactNode, data: { [key: string]: any } }, { error: any, errorInfo: any }> {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          return encodeURIComponent(key) + "=" + encodeURIComponent(preFilledFormValues[key])
        })
        .join("&")

      return (
        <Grid item xs={12}>
          <IntlTypography color="error">Something went wrong.</IntlTypography>

          <Typography>
            {/*
            Weird TS error component property does not exist
            //@ts-ignore */}
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

interface Props extends FormikFormProps, WrappedComponentProps {
  routerDisabled?: boolean
  disableSubmit?: boolean
  disableGridContainer?: boolean
}

const Form: React.ComponentType<Props> = ({ intl, children, routerDisabled, disableSubmit = false, disableGridContainer = false, ...props }: Props) => {
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

  const { values: values2, status, isSubmitting } = useFormikContext()

  // Minor fix
  const values = values2 as {[key: string]: any}

  const gridChildren = (
    <>
      {children}

      <HttpErrorHandler status={status} data={values} />
      {disableSubmit ?
        null :
        <Submit isSubmitting={isSubmitting}></Submit>
      }
    </>
  )

  return (
    <ErrorBoundary data={values}>
      <FormikForm autoComplete="off" {...props}>
        {routerDisabled ?
          null
          :
          <Prompt when={dirty} message={() => intl.formatMessage({ id: "UNSAVED_CHANGES_CONTINUE" })} />
        }

        {
          disableGridContainer ?
            gridChildren
            :
            <GridContainer>
              {gridChildren}
            </GridContainer>
        }

      </FormikForm>
    </ErrorBoundary>
  )
}

export default injectIntl(Form)

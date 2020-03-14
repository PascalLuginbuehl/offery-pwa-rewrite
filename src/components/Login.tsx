import { createStyles, Theme, Grid } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import LockIcon from "@material-ui/icons/LockOutlined"
import React, { MouseEvent } from "react"
import { FormattedMessage, WrappedComponentProps, injectIntl } from "react-intl"

import LoginService, { LoginInformation } from "../services/LoginService"
import IntlTypography from "./Intl/IntlTypography"
import { WithResourceProps, withResource } from "../providers/withResource"
import { Form as FormikForm, FormikProps, Field, withFormik } from "formik"
import FormikTextField from "./FormikFields/FormikTextField"
import HttpErrorHandler from "./HttpErrorHandler"

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      width: "auto",
      display: "block", // Fix IE 11 issue.
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      marginTop: theme.spacing(3),
    },
  })

interface Values {
  Email: string
  Password: string
}

interface Props extends WithStyles<typeof styles>, WrappedComponentProps, WithResourceProps {
  onLoginSuccess: () => void
}

class Login extends React.Component<Props & FormikProps<Values>> {
  public render() {
    const { classes, isSubmitting, status, values } = this.props
    return (
      <>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <IntlTypography component="h1" variant="h5">
              SIGN_IN
            </IntlTypography>

            <FormikForm>
              <Grid container spacing={2}>
                <Field
                  label="EMAIL"
                  name="Email"
                  required
                  type="email"

                  autoFocus
                  autoComplete="username"

                  component={FormikTextField}
                  overrideGrid={{ xs: 12, md: undefined }}
                />
                <Field
                  label="PASSWORD"
                  name="Password"

                  type="password"
                  autoComplete="current-password"

                  required
                  component={FormikTextField}
                  overrideGrid={{ xs: 12, md: undefined }}
                />
              </Grid>

              {status && status.message === "Invalid credentials" ?
                <Grid item xs={12}>
                  <IntlTypography color="error" variant="subtitle2">EMAIL_OR_PASSWORD_INVALID</IntlTypography>
                </Grid>
                :
                <HttpErrorHandler status={status} data={values} />
              }

              <br />

              <Grid item xs={12}>
                <Button disabled={isSubmitting} type="submit" fullWidth variant="contained" color="primary">
                  <FormattedMessage id="SIGN_IN" />
                </Button>
              </Grid>
            </FormikForm>
          </Paper>
        </main>
      </>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ Password: "", Email: "" }),

        handleSubmit: async (values, actions) => {
          try {
            await LoginService.login(values)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.onLoginSuccess()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(Login)
    )
  )
)

import { createStyles, Theme } from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import Button from "@material-ui/core/Button"
import CssBaseline from "@material-ui/core/CssBaseline"
import Paper from "@material-ui/core/Paper"
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles"
import Typography from "@material-ui/core/Typography"
import LockIcon from "@material-ui/icons/LockOutlined"
import React, { MouseEvent } from "react"
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl"

import LoginService, { LoginInformation } from "../services/LoginService"
import IntlTypography from "./Intl/IntlTypography"
import Validator from "./Validator"
import Submit from "./Validator/Submit"
import ValidatedTextField from "./Validator/ValidatedTextField"
import { handleChangeFunction } from "./Validator/HandleChangeFunction"
import { WithResourceProps, withResource } from "../providers/withResource"
import { FormikProps, Field, withFormik } from "formik"
import Form from "./FormikFields/Form"
import FormikTextField from "./FormikFields/FormikTextField"

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

interface Values  {
  Email: string
  Password: string
}

interface Props extends WithStyles<typeof styles>, InjectedIntlProps, WithResourceProps {
  onLoginSuccess: () => void
}

class Login extends React.Component<Props & FormikProps<Values>> {
  public render() {
    const { classes } = this.props
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

            <Form routerDisabled>
              <Field
                label="EMAIL"
                name="Email"
                required

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
            </Form>
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
            console.log("asd")
          }
        },
      })(Login)
    )
  )
)

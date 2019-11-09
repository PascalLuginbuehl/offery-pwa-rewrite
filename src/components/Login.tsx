import { createStyles, Theme } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Paper from '@material-ui/core/Paper'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import LockIcon from '@material-ui/icons/LockOutlined'
import React, { MouseEvent } from 'react'
import { FormattedMessage } from 'react-intl'

import LoginService, { LoginInformation } from '../services/LoginService'
import IntlTypography from './Intl/IntlTypography';
import Validator from './Validator';
import Submit from './Validator/Submit';
import ValidatedTextField from './Validator/ValidatedTextField';
import { handleChangeFunction } from './Validator/HandleChangeFunction';

interface State extends LoginInformation {

}

const styles = (theme: Theme) =>
  createStyles({
    layout: {
      width: 'auto',
      display: 'block', // Fix IE 11 issue.
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
        width: 400,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      marginTop: theme.spacing(3),
    },
  })


interface Props extends WithStyles<typeof styles> {
  onLoginSuccess: () => void
}

class Login extends React.Component<Props, State> {
  public state = {
    Email: "development@besapp.net",
    Password: "SuperPass",
  }

  private handleSubmit = async (): Promise<void> => {

    const promise = LoginService.login(this.state)
    promise.then(e => this.props.onLoginSuccess())
   // this.props.history.push("/")

    return promise
  }

  private handleChange = handleChangeFunction<State>(this)

  public render() {
    const { classes } = this.props
    const { Email, Password } = this.state

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <IntlTypography component="h1" variant="h5">
              SIGN_IN
            </IntlTypography>
            <Validator>
              <ValidatedTextField
                required
                fullWidth
                noGrid
                autoFocus

                autoComplete="username"

                value={Email}
                name="Email"
                label="EMAIL"
                onChange={this.handleChange}
              />

              <ValidatedTextField
                required
                fullWidth
                noGrid
                type="password"
                margin="normal"
                autoComplete="current-password"
                value={Password}
                name="Password"
                label="PASSWORD"
                onChange={this.handleChange}
              />

              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              {/*
              //@ts-ignore */}
              <Submit
                // fullWidth
                // variant="contained"
                // color="primary"
                // className={classes.submit}
                onSubmit={this.handleSubmit}
              />

            </Validator>
          </Paper>
        </main>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Login)

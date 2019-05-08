import { IconButton, Theme, Tooltip, WithStyles } from '@material-ui/core'
import { createStyles, withStyles } from '@material-ui/core'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ChatIcon from '@material-ui/icons/Chat'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FlagIcon from '@material-ui/icons/Flag'
import SettingsIcon from '@material-ui/icons/Settings'
import { withResource, WithResourceProps } from '../../providers/withResource'
import { withLanguage, WithLanguageProps } from '../../providers/withLanguage'
import * as React from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'


const styles = (theme: Theme) =>
  createStyles({
    user: {
      position: "absolute",
      right: 24,
      top: 0,
      // display: "block",
      color: "white",
      height: "100%",
      "& h3": {
        lineHeight: "64px",
      },
      display: "flex",
      alignItems: "center",
    },
    iconSize: {
      fontSize: 16
    },
  })


interface Props extends WithStyles<typeof styles>, WithLanguageProps, InjectedIntlProps, WithResourceProps {

}

interface State {
  anchorEl: any,
  openNestedLanguages: boolean,
}

class UserDisplay extends React.Component<Props, State> {

  public state: State = {
    anchorEl: null,
    openNestedLanguages: false,
  }

  public logout() {
    // localStorage.removeItem("PROCESS_AUTH_TOKEN")
    localStorage.removeItem("resource")
    localStorage.removeItem("BEARER_TOKEN")
    window.location.reload()
  }

  public handleMenu = (event: any) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  public handleClose = () => {
    this.setState({ anchorEl: null })
  }

  public changeLanguage = (lang: string) => (event: any) => {
    this.props.changeLanguage(lang)
    // currentLocale.setLanguage(lang)
  }

  public toggleLanguages = () => {
    this.setState({ openNestedLanguages: !this.state.openNestedLanguages })
  }

  public render() {
    const { classes, intl } = this.props
    const { openNestedLanguages } = this.state

    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.user}>
        <Tooltip title={intl.formatMessage({ id: "SETTINGS" })} placement="bottom">
          <IconButton color="inherit" onClick={this.handleMenu}><SettingsIcon /></IconButton>
        </Tooltip>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.toggleLanguages}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText inset>
              <FormattedMessage id='LANGUAGE' />
            </ListItemText>
            {openNestedLanguages ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </MenuItem>
          <Collapse in={openNestedLanguages} timeout="auto" unmountOnExit>
            <List disablePadding>
              <ListItem button onClick={this.changeLanguage("de")}>
                <ListItemIcon>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText inset>
                  <FormattedMessage
                    id='GERMAN'
                  />
                </ListItemText>
              </ListItem>
              <ListItem button onClick={this.changeLanguage("en")}>
                <ListItemIcon>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText inset>
                  <FormattedMessage
                    id='ENGLISH'
                  />
                </ListItemText>
              </ListItem>
              <ListItem button onClick={this.changeLanguage("fr")}>
                <ListItemIcon>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText inset>
                  <FormattedMessage
                    id='FRENCH'
                  />
                </ListItemText>
              </ListItem>
              <ListItem button onClick={this.changeLanguage("it")}>
                <ListItemIcon>
                  <FlagIcon />
                </ListItemIcon>
                <ListItemText inset>
                  <FormattedMessage
                    id='ITALIAN'
                  />
                </ListItemText>
              </ListItem>
            </List>
          </Collapse>
        </Menu>

        {/* <Typography variant="subtitle1" color="inherit">
          <span style={{ marginLeft: 10 }}>{resource.CurrentUser.Email}</span>
        </Typography> */}

        <Tooltip title={intl.formatMessage({ id: "LOGOUT" })} placement="bottom">
          <IconButton color="inherit" onClick={this.logout}><ExitToAppIcon /></IconButton>
        </Tooltip>
      </div>
    )
  }
}

export default withResource(withLanguage(injectIntl(withStyles(styles)(UserDisplay))))

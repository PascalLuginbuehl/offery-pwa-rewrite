import * as React from 'react'
import { Divider, Theme, createStyles, WithStyles, List, withStyles } from '@material-ui/core';
import NavItem from './NavItem';
import { RouteComponentProps, withRouter } from 'react-router';

const styles = (theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  })

interface State {

}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
  onDrawerRender(element: HTMLDivElement): void
}

class Navigation extends React.Component<Props, State> {

  setNavigationElementPortal = (element: HTMLDivElement | null) => {
    if(element) {
      this.props.onDrawerRender(element)
    }
  }

  public render() {
    // const { classes, value, onClick } = this.props
    const { classes } = this.props

    return (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <NavItem to="/" title="HOME" nested/>

          {/* <ListItem button>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="HOME" />
          </ListItem> */}

          <Divider />


          <div ref={this.setNavigationElementPortal} />
        </List>
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Navigation))

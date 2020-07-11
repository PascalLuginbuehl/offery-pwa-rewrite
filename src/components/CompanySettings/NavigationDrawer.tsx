import React from "react"
import Divider from "@material-ui/core/Divider"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import List from "@material-ui/core/List"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { useTranslation } from "react-i18next"
import { Link, LinkProps } from "react-router-dom"


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  }),
)

export function CustomListItem(props: LinkProps) {
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  return (<Link {...props} component={({ navigate, ...props }) => <ListItem {...props} button onClick={navigate} />}/>)
}

export default function NavigationDrawer() {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <CustomListItem to={"/company"}>
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary={t("COMPANYSETTINGS.MASTERDATA")} />
        </CustomListItem>
      </List>
    </div>
  )
}

import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core'
import * as React from 'react'
import CheckGrid from './CheckGrid';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
      // height: 250,
      backgroundColor: theme.palette.background.default,
      // border: "1px solid grey",
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
      boxSizing: "border-box",
    },
    select: {
      padding: theme.spacing(2)
    },
  })

interface State {

}

export interface GridSelectItem {
  id: string
  name: string
}

interface Props extends WithStyles<typeof styles> {
  options: Array<GridSelectItem>
  onSelect(item: GridSelectItem): void
}

class GridSelect extends React.Component<Props, State> {
  public render() {
    const { classes, options, onSelect } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          {options.map((data, index) => (
            <CheckGrid value={data.name} key={index} onClick={() => onSelect(data)}/>
          ))}
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(GridSelect)

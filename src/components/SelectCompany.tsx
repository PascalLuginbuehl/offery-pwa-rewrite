import { createStyles,  Theme, WithStyles, withStyles, List, ListItemText, ListItem, ListItemSecondaryAction, IconButton } from "@material-ui/core"
import * as React from "react"
import { ICompany } from "../interfaces/ICompany"
import ForwardIcon from "@material-ui/icons/Forward"

import ResourceService from "../services/ResourceService"
import IntlTypography from "./Intl/IntlTypography"

const styles = (theme: Theme) =>
  createStyles({

  })


interface State {

}

interface Props extends WithStyles<typeof styles> {
  onSelect: (company: ICompany) => void
  companies: ICompany[]
}

class SelectCompany extends React.Component<Props, State> {

  componentDidMount() {
    const companiesPromise = ResourceService.fetchCompanies()

    companiesPromise.then((companies) => {
      this.setState({ companies })
    })

    this.setState({ initialLoading: companiesPromise})
  }

  public render() {
    const { classes, onSelect, companies } = this.props

    return (

      <List>
        {companies.length > 0 ? companies.map(company => (
          <ListItem key={company.CompanyId} disableGutters>
            <ListItemText primary={company.Name} secondary={company.Email} />

            <ListItemSecondaryAction>
              <IconButton onClick={() => onSelect(company)}>
                <ForwardIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
          :
          (<IntlTypography>NO_COMPANIES_FOUND</IntlTypography>)
        }
      </List>
    )
  }
}

export default withStyles(styles)(SelectCompany)

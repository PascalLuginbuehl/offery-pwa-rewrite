import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core"
import { Formik, FormikProps, withFormik } from "formik"
import { injectIntl, InjectedIntlProps } from "react-intl"
import { IPostBuilding, IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import Submit from "../../../components/FormikFields/Submit"
import PageHeader from "../../../components/PageHeader"
import { RouteComponentProps, Prompt } from "react-router"

const styles = (theme: Theme) => createStyles({})

interface Values {
  buildings: IBuilding[]
}

interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps, RouteComponentProps {
  nextPage: () => void
  buildings: IBuilding[]
}

class CleaningBuilding extends React.Component<Props & FormikProps<Values>, {}> {
  public render() {
    const { isSubmitting, status, resource, selectedCompany, buildings } = this.props

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="BUILDING" />

          <List>
            {buildings.map(building => (
              <ListItem key={building.BuildingId}>
                <ListItemText
                  primary={building.Address.Street}
                  secondary={""}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    {/* <DeleteIcon /> */}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

        </Form>
      </Grid>
    )
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ buildings: props.buildings }),

        handleSubmit: async (values, actions) => {
          try {
            await Promise.resolve()
            // await actions.props.onChangeAndSave(values.building)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(CleaningBuilding)
    )
  )
)


import * as React from "react"



import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { createStyles, Grid, Theme, WithStyles, withStyles,       Typography } from "@material-ui/core"

import PlainLink from "../components/PlainLink"
import Wrapper from "../components/Form/Wrapper"
import IntlTypography from "../components/Intl/IntlTypography"
import { WithResourceProps, withResource } from "../providers/withResource"
import DashboardService from "../services/LeadService"
import { ICompressedLead } from "../interfaces/ILead"
import { Formik, Form, Field } from "formik"

import FormikTextField from "../components/FormikFields/FormikTextField"

import LeadTable from "../components/Dashboard/LeadTable"
import withWidth, { isWidthUp, WithWidth } from "@material-ui/core/withWidth"
import MobileDashboard from "../components/Dashboard/MobileDashboard"
import Fuse, { FuseOptions } from "fuse.js"
import debounce from "debounce"

const styles = (theme: Theme) =>
  createStyles({
    positionAddRight: {
      padding: theme.spacing(2),
      textAlign: "right",
    },
    root: {
      padding: theme.spacing(1),
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(2),
      },
    },
  })

const options: FuseOptions<ICompressedLead> = {
  // shouldSort: true,
  threshold: 0.1,
  location: 0,
  tokenize: true,
  distance: 2,

  maxPatternLength: 32,
  minMatchCharLength: 4,
  keys: [
    // "LeadId",
    {name: "Customer.Firstname", weight: 1.0},
    {name: "Customer.Lastname", weight: 1.0},
    {name: "Customer.CompanyName", weight: 1.0},
    {name: "Customer.TelephoneNumber", weight: 1.0},
    {name: "Customer.Email", weight: 1.0},
    // "FromAddress.Street",
    // "FromAddress.PLZ",
    {name: "FromAddress.City", weight: 0.1},
    // "ToAddress.Street",
    // "ToAddress.PLZ",
    { name: "ToAddress.City", weight: 0.1},
  ]
}

interface _State {
  leads: ICompressedLead[]
  filteredLeads: ICompressedLead[] | null
  leadsAwait: Promise<any> | null
  fuse: Fuse<ICompressedLead, typeof options> | null
}

interface Props extends WithStyles<typeof styles>, WithResourceProps, WithWidth {

}

interface AutoSubmitProps {
  values: any
  submitForm: () => void
}

const AutoSubmit: React.FC<AutoSubmitProps> = ({ values, submitForm }) => {
  type deboundeFunctionType = () => void

  const [debounceFunction, setDebounceFunction] = React.useState<null | deboundeFunctionType>(null)

  React.useEffect(() => {
    setDebounceFunction(() => debounce(() => { submitForm() }, 200))
  }, [submitForm])

  React.useEffect(() => {
    if (debounceFunction) {
      debounceFunction()
    }
  }, [values, submitForm])


  return null
}


class TableDashboard extends React.Component<Props, _State> {
  state: _State = {
    leads: [],
    fuse: null,
    filteredLeads: null,
    leadsAwait: null,
  }

  async componentDidMount() {
    const leadsAwait = DashboardService.fetchCompanyLeads(this.props.selectedCompany.CompanyId).catch(e => {
      return []
    })

    this.setState({ leadsAwait: leadsAwait })

    const leads = await leadsAwait
    this.setState({ leads: leads, fuse: new Fuse(leads, options) })
  }


  filterFields = (searchString: string) => {
    const { fuse } = this.state

    if (!fuse) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const result: ICompressedLead[] = fuse.search(searchString.trim())

    this.setState({ filteredLeads: result })
  }

  public render() {
    const { classes, selectedCompany, resource, width } = this.props
    const { leads, leadsAwait, filteredLeads } = this.state

    return (
      <Wrapper initialLoading={leadsAwait} >
        <Grid container spacing={2} className={classes.root}>
          <Grid item xs={12}>
            <Typography variant="h5">{selectedCompany.Name}</Typography>
            <IntlTypography variant="caption">COMPANY_LEAD_OVERVIEW</IntlTypography>
          </Grid>

          <Grid item xs={12}>
            <Formik
              initialValues={{
                search: "",
                status : "",
              }}

              onSubmit={( { search }, actions ) => {
                this.filterFields(search)
                actions.setSubmitting(false)
              }}
            >
              {({submitForm, values}) => (
                <Form>
                  <Grid container spacing={1}>
                    {/*<Field
                      label="STATUS"
                      name="status"
                      component={FormikSimpleSelect}
                      overrideGrid={{xs: 4, md: 2}}
                      options={resource.Statuses.map(e => ({ label: e.NameTextKey, value: e.StatusId }))}
                    />*/}

                    <Field component={FormikTextField} name="search" label="SEARCH" disabled={false} overrideGrid={{ xs: 12 }} />


                    <AutoSubmit values={values} submitForm={submitForm} />
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>

          <Grid item xs={12}>
            {isWidthUp("sm", width) ? <LeadTable leads={filteredLeads !== null ? filteredLeads : leads} /> : <MobileDashboard leads={filteredLeads !== null ? filteredLeads : leads} />}

            <div className={classes.positionAddRight}>
              <PlainLink to="/lead/new">
                <Fab color="primary" size="small">
                  <AddIcon fontSize="small" />
                </Fab>
              </PlainLink>
            </div>
          </Grid>
        </Grid>
      </Wrapper>
    )
  }
}

export default withWidth()(withResource(withStyles(styles)(TableDashboard)))

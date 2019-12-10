import * as React from "react"
import { createStyles, Theme, WithStyles, withStyles, Grid, TextField as MuiTextField, Divider, Typography, Button, ListItem, List, IconButton, ListItemText, ListItemSecondaryAction, TextField } from "@material-ui/core"
import { Formik, FormikProps, withFormik, Field, FieldArray } from "formik"
import { injectIntl, InjectedIntlProps, FormattedDate, FormattedMessage } from "react-intl"
import MoveOut from "../../components/FormikFields/Bundled/MoveOut"
import { IPostMoveInBuilding } from "../../interfaces/IBuilding"
import Form from "../../components/FormikFields/Form"
import { withResource, WithResourceProps } from "../../providers/withResource"
import Submit from "../../components/FormikFields/Submit"
import PageHeader from "../../components/PageHeader"
import MoveIn from "../../components/FormikFields/Bundled/MoveIn"
import FormikGroups from "../../components/FormikFields/Bundled/Groups"
import FormikSimpleSelect from "../../components/FormikFields/FormikSimpleSelect"
import FormikTextField from "../../components/FormikFields/FormikTextField"

import FormikButtonCheckbox from "../../components/FormikFields/FormikButtonCheckbox"
import { IPostLead, ILead } from "../../interfaces/ILead"
import FormikDateTimePicker from "../../components/FormikFields/FormikDateTimePicker"
import IntlTypography from "../../components/Intl/IntlTypography"
import { IBuildingCopy } from "../../components/FormikFields/Bundled/BuildingCopy"
import { IAddress } from "../../interfaces/IAddress"
import LeadAPI from "../LeadAPI"
import LeadService from "../../services/LeadService"
import SelectAddress from "../../components/FormikFields/Bundled/SelectAddress"
import OfferService from "../../services/OfferService"
import AddIcon from "@material-ui/icons/Add"
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline"
import { RouteComponentProps } from "react-router";


function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

const styles = (theme: Theme) => createStyles({})

interface Values {
  OfferId: number | null
  CCEmailList: string[]
  Comment: string
}

interface Props extends RouteComponentProps<{ offerId?: string }>, WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  nextPage: () => void
  lead: ILead
}

interface State {
  emailValue: string
}

// KWIKFIX for email
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class SendOffer extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    emailValue: "",
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ emailValue: event.target.value })
  }

  public render() {
    const { isSubmitting, status, resource, selectedCompany, values, lead, intl } = this.props
    const { OfferEmailBodyContentIntroTextKey, OfferEmailSubjectTextKey, OfferEmailBodyContentOutroTextKey } = selectedCompany.Settings
    const { emailValue } = this.state
    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="SEND_OFFER" />
          <Grid item xs={12}>
            <Typography>
              <FormattedMessage id={OfferEmailBodyContentIntroTextKey} values={{ br: <br /> }} />
            </Typography>

            <Typography>
              <FormattedMessage id={OfferEmailSubjectTextKey} values={{ br: <br /> }} />
            </Typography>

            <Typography>
              <FormattedMessage id={OfferEmailBodyContentOutroTextKey} values={{ br: <br /> }} />
            </Typography>
          </Grid>

          <Field
            label="OFFER"
            name="OfferId"
            component={FormikSimpleSelect}
            notTranslated
            options={lead.Offers.sort((offer1, offer2) => new Date(offer2.Created).getTime() - new Date(offer1.Created).getTime()).map(offer => ({
              label: offer.FromTemplate + ", " + intl.formatDate(offer.Created, { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }),
              value: offer.OfferId,
            }))}
          />

          <Grid item xs={12} md={6}>
            <FieldArray
              name="CCEmailList"
              render={arrayHelpers =>
                <List dense>
                  {values.CCEmailList.map((email, index) => (
                    <ListItem key={index} dense>
                      <ListItemText primary={email} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => arrayHelpers.remove(index)}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}

                  <ListItem>
                    <ListItemText primary={<TextField label={intl.formatMessage({ id: "EMAIL" })} value={emailValue} type="email" onChange={this.handleChange} />} />

                    <ListItemSecondaryAction>
                      <IconButton disabled={isSubmitting || !emailValue || !EMAIL_REGEX.test(emailValue.toLowerCase())} onClick={() => {arrayHelpers.push(emailValue); this.setState({emailValue: ""})}} edge="end">
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              }
            />
          </Grid>

          <Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12, md: undefined }} />

          {status && status.msg && <div>{status.msg}</div>}

          <Grid item xs={12}>
            <Button onClick={this.sendAndSubmit} disabled={!values.OfferId || isSubmitting} variant="contained">
              <FormattedMessage id="SEND_EMAIL" />
            </Button>
          </Grid>

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }

  sendAndSubmit = async () => {
    const { lead, submitForm, values, setSubmitting } = this.props
    const { OfferId, Comment, CCEmailList} = values

    setSubmitting(true)

    if (LeadAPI.isCompleteLead(lead) && OfferId) {
      await OfferService.sendOffer(OfferId, CCEmailList, Comment)
    }

    submitForm()
  }
}

export default injectIntl(
  withStyles(styles)(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => {
          if (props.match.params.offerId) {
            const selectedOfferId = parseInt(props.match.params.offerId)
            if (!isNaN(selectedOfferId)) {
              const offer = props.lead.Offers.find(offer => offer.OfferId === selectedOfferId)

              if (offer) {
                return { OfferId: selectedOfferId, Comment: "", CCEmailList: [] }
              }
            }
          }

          return { OfferId: null, Comment: "", CCEmailList: [] }
        },

        handleSubmit: async (values, actions) => {
          actions.setSubmitting(false)

          actions.resetForm()
          actions.props.nextPage()
        },
      })(SendOffer)
    )
  )
)

import { Grid, Typography } from '@material-ui/core'
import IntlTypography from '../../components/Intl/IntlTypography'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource'
import { ILead, IPostLead } from '../../interfaces/ILead'
import { IMoveOutBuilding, IMoveInBuilding, IStorageBuilding, IDisposalOutBuilding, ICleaningBuilding } from '../../interfaces/IBuilding';
import { FormattedDate } from 'react-intl';
import Submit from '../../components/Validator/Submit';
import ValidatedSelect from '../../components/Validator/Select/ValidatedSelect';
import ValidatedTextField from '../../components/Validator/ValidatedTextField';
import { handleChangeFunction } from '../../components/Validator/HandleChangeFunction';

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

interface State {
  AddressId: number | null
  Comment: string
}

interface Props extends WithResourceProps {
  CleaningBuilding: ICleaningBuilding | null
  MoveOutBuilding: IMoveOutBuilding | null
  MoveInBuilding: IMoveInBuilding | null
  StorageInBuilding: IStorageBuilding | null
  DisposalOutBuilding: IDisposalOutBuilding | null
  Lead: IPostLead | null
  LeadId: number
}

class EmailConfirmation extends React.Component<Props, State> {
  state: State = {
    AddressId: null,
    Comment: '',
  }
  private handleChange = handleChangeFunction<State>(this)

  send = () => {
    return Promise.resolve()
  }


  public render() {
    const { selectedCompany } = this.props
    const { AddressId, Comment } = this.state
    const { Lead, CleaningBuilding, MoveOutBuilding, MoveInBuilding, StorageInBuilding, DisposalOutBuilding } = this.props

    const { EmailBodyContentIntroductionTextKey, EmailBodyContentOutroductionTextKey, EmailSubjectTextKey } = selectedCompany.Settings.VisitConfirmationSetting

    return (
      <>
        <Grid item xs={12}>
          <IntlTypography variant="h5">EMAIL_CONFIRMATION</IntlTypography>
        </Grid>

        <Grid item xs={12}>
          <IntlTypography>
            {EmailBodyContentIntroductionTextKey}
          </IntlTypography>
          <IntlTypography>
            {EmailSubjectTextKey}
          </IntlTypography>
          {Lead && Lead.VisitDate ? (<><IntlTypography>VISITING_DATE</IntlTypography><Typography><FormattedDate value={Lead.VisitDate} /></Typography></>) : null}
          <IntlTypography>
            {EmailBodyContentOutroductionTextKey}
          </IntlTypography>
        </Grid>

        <ValidatedSelect
          label="BUILDING_TYPE"
          value={AddressId}
          name="AddressId"
          onChange={this.handleChange}
          required
          options={[CleaningBuilding, MoveOutBuilding, MoveInBuilding, StorageInBuilding, DisposalOutBuilding].filter(notEmpty).map(e => ({id: e.Address.AddressId, NameTextKey: e.Address.Street + ", " + e.Address.PLZ + " " + e.Address.City, OrderNumber: 0}))}
        />

        <ValidatedTextField
          label="COMMENT"
          value={Comment}
          name="Comment"
          onChange={this.handleChange}
        />

        <Submit onSubmit={this.send}/>
     </>
    )
  }
}

export default withResource(EmailConfirmation)

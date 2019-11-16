import { Grid, Typography } from '@material-ui/core'
import IntlTypography from '../../components/Intl/IntlTypography'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource'
import { ILead, IPostLead } from '../../interfaces/ILead'
import { IMoveOutBuilding, IMoveInBuilding, IStorageBuilding, IDisposalOutBuilding, ICleaningBuilding, IPostCleaningBuilding, IPostMoveInBuilding, IPostStorageBuilding, IPostDisposalOutBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import { FormattedDate } from 'react-intl';
import Submit from '../../components/Validator/Submit';
import ValidatedSelect from '../../components/Validator/Select/ValidatedSelect';
import ValidatedTextField from '../../components/Validator/ValidatedTextField';
import { handleChangeFunction } from '../../components/Validator/HandleChangeFunction';
import LeadAPI, { ILeadContainer } from '../LeadAPI';
import FormTemplate from './FormTemplate';
import { IAddress } from '../../interfaces/ICompany';
import LeadService from '../../services/LeadService';
import ValidatedForm from '../../components/Validator/ValidatedForm';

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

interface State {
  AddressId: number | null
  Comment: string
}

interface Props extends WithResourceProps {
  container: ILeadContainer
}

class EmailConfirmation extends FormTemplate<Props, State> {
  state: State = {
    AddressId: null,
    Comment: '',
  }
  private handleChange = handleChangeFunction<State>(this)

  send = (): Promise<void> => {
    const { AddressId, Comment } = this.state
    const { Lead } = this.props.container

    if (LeadAPI.isCompleteLead(Lead) && AddressId) {
      return new Promise(async (resolve, reject) => {
        await LeadService.sendVisitConfirmation({ LeadId: Lead.LeadId, Comment: Comment, AddressId: AddressId })

        await this.saveFunction()
        resolve()
      })
    }

    return Promise.resolve()
  }

  public render() {
    const { selectedCompany, container } = this.props
    const { AddressId, Comment } = this.state
    const { Lead } = this.props.container

    const { EmailBodyContentIntroductionTextKey, EmailBodyContentOutroductionTextKey, EmailSubjectTextKey } = selectedCompany.Settings.VisitConfirmationSetting
    const { cleaning: CleaningBuilding, moveOut: MoveOutBuilding, moveIn: MoveInBuilding, storage: StorageInBuilding, disposal: DisposalOutBuilding,  } = container

    return (
      <ValidatedForm>
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
          label="VISIT_ADDRESS"
          value={AddressId}
          name="AddressId"
          onChange={this.handleChange}
          required
          notTranslatedLabel={false}
          options={[CleaningBuilding, MoveOutBuilding, MoveInBuilding, StorageInBuilding, DisposalOutBuilding].filter(notEmpty).map(e => e.Address).filter((e): e is IAddress => e.hasOwnProperty('AddressId')).map((e, index) => ({ value: e.AddressId, label: e.Street + ", " + e.PLZ + " " + e.City}))}
        />

        <ValidatedTextField
          label="COMMENT"
          value={Comment}
          name="Comment"
          onChange={this.handleChange}
          multiline
        />

        {/* Only available when online */}
        <Submit onSubmit={this.send}/>
      </ValidatedForm>
    )
  }
}

export default withResource(EmailConfirmation)

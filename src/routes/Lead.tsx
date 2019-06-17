import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, ListSubheader, Collapse, Icon } from '@material-ui/core'
import { IPostLead, emptyLead, ILead } from '../interfaces/ILead';
import IntlTypography from '../components/Intl/IntlTypography';
import ValidatedDateTimePicker from '../components/Validator/ValidatedDateTimePicker';
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
import { get, set } from 'idb-keyval'
import {
  IMoveOutBuilding,
  IMoveInBuilding,
  ICleaningBuilding,
  IDisposalOutBuilding,
  IStorageBuilding,
  emptyDisposalOutBuilding,
  emptyMoveInBuilding,
  emptyMoveOutBuilding,
  emptyStorageBuilding,
  emptyCleaningBuilding
} from '../interfaces/IBuilding';
import BuildingService from '../services/BuildingService';
import { RouteComponentProps, Route } from 'react-router';
import LeadService from '../services/LeadService';
import Customer from './Customer';
import Loading from '../components/Loading';
import MoveOutBuilding from './Customer/MoveOutBuilding';
import { FormattedMessage } from 'react-intl';
import NavItem from '../components/Navigation/NavItem';
import MoveInBuilding from './Customer/MoveInBuilding';
import CleaningBuilding from './Customer/CleaningBuilding';
import DisposalOutBuilding from './Customer/DisposalOutBuilding';
import StorageBuilding from './Customer/StorageBuilding';
import EmailConfirmation from './Customer/EmailConfirmation';
import SuccessSnackbar from '../components/SuccessSnackbar';
import OfflinePinIcon from '@material-ui/icons/OfflinePin'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import IntlTooltip from '../components/Intl/IntlTooltip';

export interface ILeadContainer {
  lastUpdated: Date
  onlySavedOffline: boolean

  Lead: ILead | null

  moveOut: IMoveOutBuilding | null
  moveIn: IMoveInBuilding | null
  cleaning: ICleaningBuilding | null
  disposal: IDisposalOutBuilding | null
  storage: IStorageBuilding | null
}

interface State extends ILeadContainer {
  initialAwait: Promise<any> | null
  leadId: number | null
  loadedFromOffline: boolean

  successOpen: boolean
}

interface Props extends RouteComponentProps<{ id?: string }> {
  portal: HTMLDivElement | null
}

class Lead extends Component<Props, State> {
  state: State = {
    lastUpdated: new Date(),
    leadId: null,
    Lead: null,
    moveOut: null,
    moveIn: null,
    disposal: null,
    storage: null,
    cleaning: null,

    initialAwait: null,
    onlySavedOffline: false,
    loadedFromOffline: true,
    successOpen: false,
  }

  handleClose = () => {
    this.setState({successOpen: false})
  }

  public handleChange = handleChangeFunction<State>(this)

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (!isNaN(potentialLeadId)) {

      this.setState({initialAwait: this.loadFromOfflineOrOnline(potentialLeadId)})
    } else {
      console.log("Is not a leadId", potentialLeadId)
      throw Error("Did not find a lead")
    }
  }

  loadFromOfflineOrOnline = (potentialLeadId: number): Promise<void> => {
    return new Promise(async(resolve, reject) => {

      const offline = await this.FetchFromOffline(potentialLeadId)
      if (offline && offline.onlySavedOffline) {
        try {
          await this.SaveToApi(potentialLeadId, offline)

          // Removed onlySavedOfflineProperty
          await this.SaveToOffline(potentialLeadId, { ...offline, onlySavedOffline: false })
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId, loadedFromOffline: true })
          resolve()
        } catch (e) {
          this.setState({ ...offline, onlySavedOffline: false, leadId: potentialLeadId, loadedFromOffline: true })
          resolve()
        }

      } else {
        const promiseOnline = this.FetchFromOnline(potentialLeadId)

        this.setState({ initialAwait: promiseOnline })
        const lead = await promiseOnline

        this.setState({ ...lead, leadId: potentialLeadId, loadedFromOffline: false })

        await this.SaveToOffline(potentialLeadId, lead)

        resolve()
      }
    })

  }

  // Can NOT CREATE!

  // Only gets called to save into Offline Storage
  FetchFromOnline(leadId: number): Promise<ILeadContainer> {
    return Promise.all([
      LeadService.fetchCustomer(leadId),
      BuildingService.fetchMoveOutBuilding(leadId),
      BuildingService.fetchMoveInBuilding(leadId),
      BuildingService.fetchCleaningBuilding(leadId),
      BuildingService.fetchStorageBuilding(leadId),
      BuildingService.fetchDisposalOutBuilding(leadId),
    ]).then(([Lead, moveOut, moveIn, cleaning, storage, disposal]): ILeadContainer => ({
      lastUpdated: new Date(),
      Lead,
      moveOut,
      moveIn,
      cleaning,
      disposal,
      storage,
      onlySavedOffline: false,
    }))
  }

  // Gets Called to Get Data From Offline
  FetchFromOffline = (leadId: number): Promise<ILeadContainer> => {
    return get(leadId)
  }

  // Saves it in Offline Storage
  SaveToOffline = (leadId: number, lead: ILeadContainer) => {
    return set(leadId, lead)
  }

  // Checks if data changed on the API side from first Fetch
  CheckAgainstAPI() {

  }

  // Sends all new Data to the API
  SaveToApi = (leadId: number, container: ILeadContainer): Promise<void> => {
    return new Promise<void>(async (resolve, reject) => {

      const { Lead, moveOut } = container
      if(Lead && moveOut && leadId) {
        try {
          await Promise.all([
            LeadService.saveCustomer(Lead),
            BuildingService.saveMoveOutBuilding(moveOut, leadId),
          ])

          console.log("Test")
          resolve()
        } catch(e) {
          console.log("Offline error?", e)
          console.dir(e)
          if (e) { // If offline
            // Check error message
            try {
              await this.SaveToOffline(leadId, { ...container, onlySavedOffline: true })
              this.setState({ onlySavedOffline: true})
              console.log("saved to offline")
              resolve()
            } catch (e) {
              console.log("couldn't save offline", e)
              reject("couldn't save offline")
            }
          }
        }
      }
    })
  }

  Save = (): Promise<void> => {
    const {leadId, initialAwait, ...lead} = this.state
    if(leadId) {

      return this.SaveToApi(leadId, lead)
    }

    return Promise.reject()
  }

  public render() {
    const {
      Lead,
      leadId,
      moveOut,
      moveIn,
      cleaning,
      storage,
      disposal,

      initialAwait,
      onlySavedOffline,
      loadedFromOffline,
      successOpen,
    } = this.state
    const { match, portal } = this.props

    return (
      <>
      {/* "Saved in cache, not saved Online!" */}
        <Wrapper initialLoading={initialAwait}>
          {onlySavedOffline ?
            <IntlTooltip title="NOT_SAVED_ONLINE">
              <OfflinePinIcon color="error" />
            </IntlTooltip>
          :
            null
          }

          {loadedFromOffline ?
            <IntlTooltip title="LOADED_FROM_CACHE">
              <CloudUploadIcon color="secondary" />
            </IntlTooltip>
          :
            null
          }


          {
            Lead != null ?
            <>

              {/* Customer */}
              <Route
                path={`${match.url}/customer`}
                render={(routeProps) =>
                  <Customer
                    {...routeProps}
                    data={Lead}
                    onChange={(data) => this.handleChange(data, "Lead")}
                    save={this.Save}
                  />
                }
              />

              {/* Move-Out */}
              <Route
                path={`${match.url}/building/move-out`}
                render={(routeProps) =>
                  <MoveOutBuilding
                    {...routeProps}
                    data={moveOut ? moveOut : emptyMoveOutBuilding(Lead.LeadId)}
                    onChange={(data) => this.handleChange(data, "moveOut")}
                    save={this.Save}
                  />
                }
              />

              {/* Move-In */}
              <Route
                path={`${match.url}/building/move-in`}
                render={(routeProps) =>
                  <MoveInBuilding
                    {...routeProps}
                    data={moveIn ? moveIn : emptyMoveInBuilding(Lead.LeadId)}
                    onChange={(data) => this.handleChange(data, "moveIn")}
                    save={this.Save}
                  />
                }
              />

              {/* Storage */}
              <Route
                path={`${match.url}/building/storage`}
                render={(routeProps) =>
                  <StorageBuilding
                    {...routeProps}
                    data={storage ? storage : emptyStorageBuilding(Lead.LeadId)}
                    onChange={(data) => this.handleChange(data, "storage")}
                    save={this.Save}
                  />
                }
              />

              {/* Disposal */}
              <Route
                path={`${match.url}/building/disposal`}
                render={(routeProps) =>
                  <DisposalOutBuilding
                    {...routeProps}
                    data={disposal ? disposal : emptyDisposalOutBuilding(Lead.LeadId)}
                    onChange={(data) => this.handleChange(data, "disposal")}
                    save={this.Save}
                  />
                }
              />

              {/* Cleaning */}
              <Route
                path={`${match.url}/building/cleaning`}
                 render={(routeProps) =>
                  <CleaningBuilding
                    {...routeProps}
                    data={cleaning ? cleaning : emptyCleaningBuilding(Lead.LeadId)}
                    onChange={(data) => this.handleChange(data, "cleaning")}
                    save={this.Save}
                  />
                }
              />

              {/* E-Mail */}
              <Route
                path={`${match.url}/email-confirmation`}
                render={(routeProps) =>
                  <EmailConfirmation
                    {...routeProps}
                    CleaningBuilding={cleaning}
                    DisposalOutBuilding={disposal}
                    Lead={Lead}
                    LeadId={Lead.LeadId}
                    MoveInBuilding={moveIn}
                    MoveOutBuilding={moveOut}
                    StorageInBuilding={storage}
                  />
                }
              />
            </>
            :
              "No Lead found"
          }
        </Wrapper>

        {/* Navigation */}
        {portal ? ReactDOM.createPortal(<>
          <ListSubheader><FormattedMessage id="EDIT_LEAD" /></ListSubheader>

            <NavItem to={`${match.url}/customer`} title="CUSTOMER">
              {Lead ? (
                <>
                  <Collapse in={Lead.HasMoveOutBuilding}><NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested /></Collapse>
                  <Collapse in={Lead.HasMoveInBuilding}><NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested /></Collapse>
                  <Collapse in={Lead.HasStorageInBuilding}><NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested /></Collapse>
                  <Collapse in={Lead.HasDisposalOutBuilding}><NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested /></Collapse>
                  <Collapse in={Lead.HasCleaningBuilding}><NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested /></Collapse>
                  <NavItem to={`${match.url}/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
                </>
              ) : null}
              {/* */}
            </NavItem>
          <NavItem to={"lead/" + match.params.id + "/service"} title="SERVICES" />
        </>, portal) : null}

        <SuccessSnackbar
          open={successOpen}
          onClose={this.handleClose}
          variant="success"
          message="This is a success message!"
          />
      </>
    )
  }
}

export default Lead

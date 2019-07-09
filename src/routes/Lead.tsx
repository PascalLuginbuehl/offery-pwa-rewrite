import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, ListSubheader, Collapse, Icon } from '@material-ui/core'
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
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
import OriginalSnackbar from '../components/SuccessSnackbar';
import OfflinePinIcon from '@material-ui/icons/OfflinePin'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import IntlTooltip from '../components/Intl/IntlTooltip';
import LeadAPI, { ILeadContainer, emptyLeadContainer } from './LeadAPI';
import { emptyLead } from '../interfaces/ILead';
import Service from './Service';
import { withResource, WithResourceProps } from '../providers/withResource';

interface State extends ILeadContainer {
  initialAwait: Promise<any> | null

  loadedFromOffline: boolean
  successOpen: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
}

class Lead extends Component<Props, State> {
  state: State = {
    ...emptyLeadContainer,

    initialAwait: null,
    loadedFromOffline: false,
    successOpen: false,
  }

  handleClose = () => {
    this.setState({successOpen: false})
  }

  public handleChange = handleChangeFunction<State>(this)

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (idString === "new") {
      this.setState({Lead: emptyLead})
    } else if (!isNaN(potentialLeadId)) {

      this.setState({initialAwait: this.loadFromOfflineOrOnline(potentialLeadId)})
    } else {
      console.log("Is not a leadId", potentialLeadId)
      throw Error("Did not find a lead")
    }
  }

  loadFromOnline(potentialLeadId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const promiseOnline = LeadAPI.FetchFromOnline(potentialLeadId)

        this.setState({ initialAwait: promiseOnline })
        const lead = await promiseOnline

        this.setState({ ...lead, loadedFromOffline: false, onlySavedOffline: false })

        await LeadAPI.SaveToOffline(potentialLeadId, lead)

        resolve()
      } catch(e) {
        reject(e)
      }
    })
  }

  loadFromOfflineOrOnline = (potentialLeadId: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {

      const offline = await LeadAPI.FetchFromOffline(potentialLeadId)

      if (offline && offline.onlySavedOffline) {
        // Upload
        try {
          await LeadAPI.SaveToApi(potentialLeadId, offline)

          try {
            await this.loadFromOnline(potentialLeadId)
          } catch (e) {

            console.log("Saving success but loading failed")
            console.dir(e)

            this.setState({ ...offline, onlySavedOffline: true, loadedFromOffline: true })
          }

        } catch(e) {
          if (e.message == "Failed to fetch") {
            console.log("Still not online to reupload")

            this.setState({ ...offline, onlySavedOffline: true, loadedFromOffline: true })
          }
        }

        resolve()
      } else {
        // Loading Data directly from online
        try {
          await this.loadFromOnline(potentialLeadId)
          resolve()
        } catch(e) {
          if (e.message == "Failed to fetch") {
            if (offline) {
              console.log("Client offline, loading from offlinestorage")
              this.setState({ ...offline, loadedFromOffline: true })

              resolve()
            } else {
              console.log("Client offline, nothing saved")
              console.log("Failed loading due to not cached and offline")

              reject()
            }


          } else {
            console.log("Lead does not exist")
            reject()
          }
        }
      }
    })
  }

  nextPageFunction = (current: string) => {
    // Check if lead is even defined
    if (this.state.Lead) {
      const { HasMoveInBuilding, HasMoveOutBuilding, HasDisposalOutBuilding, HasStorageInBuilding, HasCleaningBuilding } = this.state.Lead

      const order = [
        { name: '/', active: true },
        { name: '/building/move-out', active: HasMoveInBuilding },
        { name: '/building/move-in', active: HasMoveOutBuilding },
        { name: '/building/storage', active: HasDisposalOutBuilding },
        { name: '/building/disposal', active: HasStorageInBuilding },
        { name: '/building/cleaning', active: HasCleaningBuilding },
        { name: '/email-confirmation', active: true },
        { name: '/service', active: true },
      ]

      let lastPage = { name: '' }
      for (let index = 0; index < order.length; index++) {
        const potentialNextPage = order[index];

        if (lastPage.name == current) {
          if (potentialNextPage.active) {

            return potentialNextPage.name
          }
        } else {
          lastPage = potentialNextPage
        }
      }
    }

    return ''
  }


  Save = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const { initialAwait, successOpen, loadedFromOffline, ...lead} = this.state

      const { Lead } = lead
      if(LeadAPI.isCompleteLead(Lead)) {
        try {
          await LeadAPI.SaveToApi(Lead.LeadId, lead)
          resolve()

        } catch (e) {
          if (e.message == "Failed to fetch") {
            try {
              LeadAPI.SaveToOffline(Lead.LeadId, { ...lead, onlySavedOffline: true })
              this.setState({ onlySavedOffline: true })

              console.log("Saved to offline storage")
              resolve()

            } catch (e) {
              // Major upsie // TODO: Handle this
              console.log("Couldn't save offline", e)
              reject("Couldn't save offline")
            }
          } else {
            // Other type of error message

            console.log("Unknown error:")
            console.dir(e)
          }
        }
      } else {
        console.log("Lead not yet created")
      }
    })
  }

  Create = (): Promise<any> => {
    if (this.state.Lead) {
      const promise = LeadService.createCustomer(this.state.Lead, this.props.selectedCompany.CompanyId)

      promise.then(lead => {
        this.setState({Lead: lead, moveIn: null, cleaning: null, disposal: null, moveOut: null, storage: null})
        this.props.history.replace("/lead/" + lead.LeadId + "/customer")
      }).catch(e => {
        if (e.message == "Failed to fetch") {
          console.log("Cannot create from offline")
        } else {
          console.log("Couldn't create")
          console.dir(e)
        }
      })

      return promise
    }
    return Promise.reject()
  }


  public render() {
    const {
      Lead,
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
        <Wrapper initialLoading={initialAwait}>
          {onlySavedOffline ?
            <IntlTooltip title="NOT_SAVED_ONLINE">
              <CloudUploadIcon color="error" />
            </IntlTooltip>
          :
            null
          }

          {loadedFromOffline ?
            <IntlTooltip title="LOADED_FROM_CACHE">
              <OfflinePinIcon color="primary" />
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
                    nextPage={match.url + this.nextPageFunction('/')}
                  />
                }
              />

              {/* Move-Out */}
              <Route
                path={`${match.url}/building/move-out`}
                render={(routeProps) =>
                  <MoveOutBuilding
                    {...routeProps}
                    data={moveOut}
                    onChange={(data) => this.handleChange(data, "moveOut")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/move-out')}
                  />
                }
              />

              {/* Move-In */}
              <Route
                path={`${match.url}/building/move-in`}
                render={(routeProps) =>
                  <MoveInBuilding
                    {...routeProps}
                    data={moveIn}
                    onChange={(data) => this.handleChange(data, "moveIn")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/move-in')}
                  />
                }
              />

              {/* Storage */}
              <Route
                path={`${match.url}/building/storage`}
                render={(routeProps) =>
                  <StorageBuilding
                    {...routeProps}
                    data={storage}
                    onChange={(data) => this.handleChange(data, "storage")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/storage')}
                  />
                }
              />

              {/* Disposal */}
              <Route
                path={`${match.url}/building/disposal`}
                render={(routeProps) =>
                  <DisposalOutBuilding
                    {...routeProps}
                    data={disposal}
                    onChange={(data) => this.handleChange(data, "disposal")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/disposal')}
                  />
                }
              />

              {/* Cleaning */}
              <Route
                path={`${match.url}/building/cleaning`}
                 render={(routeProps) =>
                  <CleaningBuilding
                    {...routeProps}
                    data={cleaning}
                    onChange={(data) => this.handleChange(data, "cleaning")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/cleaning')}
                  />
                }
              />

              {/* E-Mail */}
              <Route
                path={`${match.url}/email-confirmation`}
                render={(routeProps) =>
                  <EmailConfirmation
                    {...routeProps}
                    save={this.Save}
                    container={this.state}
                    nextPage={match.url + this.nextPageFunction('/email-confirmation')}
                  />
                }
              />

              {/* Serivices */}
              <Route
                path={`${match.url}/service`}
                component={Service}
                nextPage={`${match.url}/building/disposal`}
              />
            </>
            :
              this.props.match.params.id === "new" && Lead ? (
              <Route
                path={`${match.url}/customer`}
                render={(routeProps) =>
                  <Customer
                    {...routeProps}
                    data={Lead}
                    onChange={(data) => this.handleChange(data, "Lead")}
                    save={this.Create}
                    nextPage={`${match.url}/building/disposal`}
                  />
                }
              />)
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
                  <Collapse in={Lead.HasMoveOutBuilding}><NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested/></Collapse>
                  <Collapse in={Lead.HasMoveInBuilding}><NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested/></Collapse>
                  <Collapse in={Lead.HasStorageInBuilding}><NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested/></Collapse>
                  <Collapse in={Lead.HasDisposalOutBuilding}><NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested/></Collapse>
                  <Collapse in={Lead.HasCleaningBuilding}><NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested/></Collapse>
                  <NavItem to={`${match.url}/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
                </>
              ) : null}
              {/* */}
            </NavItem>
          <NavItem to={`${match.url}/service`} title="SERVICES" />
        </>, portal) : null}
      </>
    )
  }
}

export default withResource(Lead)

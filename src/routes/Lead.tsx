import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, ListSubheader, Collapse, Icon } from '@material-ui/core'
import { handleChangeFunction } from '../components/Validator/HandleChangeFunction';
import Wrapper from '../components/Form/Wrapper';
import BuildingService from '../services/BuildingService';
import { RouteComponentProps, Route, Redirect } from 'react-router';
import LeadService from '../services/LeadService';
import Customer from './Customer';
import Loading from '../components/Loading';
import { FormattedMessage } from 'react-intl';
import NavItem from '../components/Navigation/NavItem';
import OriginalSnackbar from '../components/SuccessSnackbar';
import OfflinePinIcon from '@material-ui/icons/OfflinePin'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import IntlTooltip from '../components/Intl/IntlTooltip';
import LeadAPI, { ILeadContainer, emptyLeadContainer, checkIs } from './LeadAPI';
import { emptyLead, ILead } from '../interfaces/ILead';
import Services from './Services';
import { withResource, WithResourceProps } from '../providers/withResource';
import NavFolder from '../components/Navigation/NavFolder';
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from '../interfaces/IBuilding';
import SuccessSnackbar from '../components/SuccessSnackbar';
import MoveService from './Services/MoveService';
import { emptyMoveService, emptyPackService, emptyStorageService, emptyDisposalService, emptyCleaningService } from '../interfaces/IService';
import MaterialShop from './Services/MaterialShop';
import { ShopTypeEnum, emptyMaterialOrder } from '../interfaces/IShop';
import Inventory from './Services/Inventory';
import { InventoryKeysEnum, emptyInventory } from '../interfaces/IInventars';
import PackService from './Services/PackService';
import StorageService from './Services/StorageService';
import DisposalService from './Services/DisposalService';
import CleaningService from './Services/CleaningService';
import MoveConditions from './Conditions/MoveConditions';
import { emptyMoveServiceConditions, emptyPackServiceConditions, emptyCleaningServiceConditions, emptyStorageServiceConditions, emptyDisposalServiceConditions } from '../interfaces/IConditions';
import PackConditions from './Conditions/PackConditions';
import StorageConditions from './Conditions/StorageConditions';
import DisposalConditions from './Conditions/DisposalConditions';
import CleaningConditions from './Conditions/CleaningConditions';
import Generate from './Offer/GenerateOffer';
import PreviewOffer from './Offer/PreviewOffer';
import NewMoveOutBuilding from "./Customer/NewBuildings/MoveOutBuilding"
import NewMoveInBuilding from "./Customer/NewBuildings/MoveInBuilding"
import NewStorageBuilding from "./Customer/NewBuildings/StorageBuilding"
import NewCleaningBuilding from "./Customer/NewBuildings/CleaningBuilding"
import NewDisposalBuilding from "./Customer/NewBuildings/DisposalBuilding"
import { IBuildingCopy } from '../components/FormikFields/Bundled/BuildingCopy';
import NewCustomer from "./Customer/NewBuildings/NewCustomer"
import NewEmailConfirmation from "./Customer/NewBuildings/EmailConfirmation"
interface State {
  container: ILeadContainer | null
  initialAwait: Promise<any> | null

  loadedFromOffline: boolean

  isOffline: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
  closeNavigation: () => void
}


class Lead extends Component<Props, State> {
  state: State = {
    container: null,

    initialAwait: null,
    loadedFromOffline: false,

    isOffline: false
  }

  componentDidUpdate(prevProps: Props) {
    // Close Navigation on Navigate
    if (this.props.location !== prevProps.location) {
      this.props.closeNavigation();
    }
  }

  public handleChange = handleChangeFunction<State>(this)

  async componentDidMount() {
    const idString = this.props.match.params.id
    const potentialLeadId = parseInt(idString ? idString : "")

    if (idString === "new") {
      this.setState({Lead: emptyLead})

    } else if (!isNaN(potentialLeadId)) {
      // Load normal Lead

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

        const lead = await promiseOnline

        this.setState({ ...lead, loadedFromOffline: false, onlySavedOffline: false })

        await LeadAPI.SaveToOffline(potentialLeadId, lead)

        resolve()
      } catch(e) {
        reject(e)
      }
    })
  }

  throwGoOffline() {
    if(this.state.isOffline) {
      throw new Error("Should be offline")
    }
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

  closeError = () => {
    this.setState({errorOccured: false})
  }

  redirectToNextPage = (currentPage: string) => () => {
    const { Lead } = this.state

    if (Lead && Lead.hasOwnProperty("LeadId")) {
      const { history } = this.props

      const nextPage = this.nextPageFunction(currentPage)

      // Quickfix due to TS Lint error
      history.push("/lead/" + (Lead as ILead).LeadId + nextPage)
    }
  }

  nextPageFunction = (current: string): string => {
    // Check if lead is even defined
    if (this.state.Lead) {
      const { HasMoveInBuilding, HasMoveOutBuilding, HasDisposalOutBuilding, HasStorageInBuilding, HasCleaningBuilding } = this.state.Lead

      const {HasCleaningServiceEnabled, HasDisposalServiceEnabled, HasPackServiceEnabled, HasStorageServiceEnabled, HasMoveServiceEnabled} = this.state.services

      const order = [
        { name: '/building', active: true },
        { name: '/building/move-out', active: HasMoveInBuilding },
        { name: '/building/move-in', active: HasMoveOutBuilding },
        { name: '/building/storage', active: HasDisposalOutBuilding },
        { name: '/building/disposal', active: HasStorageInBuilding },
        { name: '/building/cleaning', active: HasCleaningBuilding },
        { name: '/building/email-confirmation', active: true },
        { name: '/services', active: true },
        { name: '/services/move', active: HasMoveServiceEnabled },
        { name: '/services/move/material-shop', active: HasMoveServiceEnabled },
        { name: '/services/move/inventory', active: HasMoveServiceEnabled },
        { name: '/services/pack', active: HasPackServiceEnabled },
        { name: '/services/pack/material-shop', active: HasPackServiceEnabled },
        { name: '/services/storage', active: HasStorageServiceEnabled },
        { name: '/services/storage/material-shop', active: HasStorageServiceEnabled },
        { name: '/services/storage/inventory', active: HasStorageServiceEnabled },
        { name: '/services/disposal', active: HasDisposalServiceEnabled },
        { name: '/services/disposal/inventory', active: HasDisposalServiceEnabled },
        { name: '/services/cleaning', active: HasCleaningServiceEnabled },
        { name: '/conditions/move', active: HasMoveServiceEnabled },
        { name: '/conditions/pack', active: HasPackServiceEnabled },
        { name: '/conditions/storage', active: HasStorageServiceEnabled },
        { name: '/conditions/disposal', active: HasDisposalServiceEnabled },
        { name: '/conditions/cleaning', active: HasCleaningServiceEnabled },
        { name: '/offer/generate', active: true },
        { name: '/offer/preview', active: true },

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


  Save = (): Promise<any> => {
    return (new Promise(async (resolve, reject) => {
      const { initialAwait, loadedFromOffline, ...lead} = this.state

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
          } else if (e.message == "Could not save lead properly") {
            // Other type of error message
            console.log("I need ma own error popup m8")
            reject("Error while saving")
          } else {
            console.log("Unknown error:", e)
            reject(e)
          }
        }
      } else {
        console.log("Lead not yet created")
      }
    })
    .catch(e => {

      console.log("Well, there was a litte error happening while savin m8")



      throw Error("Not saved")
    }))
  }

  Create = (): Promise<any> => {
    if (this.state.Lead) {
      const promise = LeadService.createCustomer(this.state.Lead, this.props.selectedCompany.CompanyId)

      promise.then(lead => {
        this.setState({Lead: lead, moveIn: null, cleaning: null, disposal: null, moveOut: null, storage: null})

        this.props.history.replace("/lead/" + lead.LeadId + this.nextPageFunction("/building"))
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
      services,
      moveService,
      materialOrder,
      inventory,
      packService,
      storageService,
      disposalService,
      cleaningService,

      initialAwait,
      onlySavedOffline,
      loadedFromOffline,
    } = this.state
    const { match, portal } = this.props

    return (
      <>
        <Wrapper initialLoading={initialAwait}>
          {onlySavedOffline ? (
            <IntlTooltip title="NOT_SAVED_ONLINE">
              <CloudUploadIcon color="error" />
            </IntlTooltip>
          ) : null}

          {loadedFromOffline ? (
            <IntlTooltip title="LOADED_FROM_CACHE">
              <OfflinePinIcon color="primary" />
            </IntlTooltip>
          ) : null}

          {this.props.match.params.id !== "new" && Lead != null && checkIs<ILead>(Lead, "LeadId") ? (
            <>
              </>
          ) : Lead ? (
            <Route
              exact
              path={`${match.url}/building`}
              render={routeProps => <Customer {...routeProps} data={Lead} onChange={data => this.handleChange(data, "Lead")} save={this.Create} />}
            />
          ) : (
            "No Lead found"
          )}
        </Wrapper>
      </>
    )
  }
}

export default withResource(Lead)

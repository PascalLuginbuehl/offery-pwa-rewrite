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
import LeadAPI, { ILeadContainer, emptyLeadContainer, checkIs } from './LeadAPI';
import { emptyLead, ILead } from '../interfaces/ILead';
import Services from './Services';
import { withResource, WithResourceProps } from '../providers/withResource';
import NavFolder from '../components/Navigation/NavFolder';
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from '../interfaces/IBuilding';
import SuccessSnackbar from '../components/SuccessSnackbar';
import MoveService from './Services/MoveService';
import { emptyMoveService, emptyPackService, emptyStorageService, emptyDisposalSerivce, emptyCleaningService } from '../interfaces/IService';
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
interface State extends ILeadContainer {
  initialAwait: Promise<any> | null

  loadedFromOffline: boolean
  successOpen: boolean

  isOffline: boolean

  errorOccured: boolean
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
  closeNavigation: () => void
}

class Lead extends Component<Props, State> {
  state: State = {
    ...emptyLeadContainer,

    initialAwait: null,
    loadedFromOffline: false,
    successOpen: false,

    errorOccured: false,

    isOffline: false
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location !== prevProps.location) {
      this.props.closeNavigation();
    }
  }

  onRouteChanged() {
    console.log("ROUTE CHANGED");
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


    // adding before unload functionality
    window.addEventListener('beforeunload', this.handleUnload)
  }

  handleUnload = (e: BeforeUnloadEvent) => {
    console.log('beforeunload called');

    // Cancel the event
    e.preventDefault();

    // Chrome requires returnValue to be set
    e.returnValue = 'sure?';
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload)
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
      successOpen,
      errorOccured,
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
              {/* Customer */}
              <Route
                exact
                path={`${match.url}/building`}
                render={routeProps => (
                  <Customer
                    {...routeProps}
                    data={Lead}
                    onChange={data => this.handleChange(data, "Lead")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction("/building")}
                  />
                )}
              />

              {/* Move-Out */}
              <Route
                exact
                path={`${match.url}/building/move-out`}
                render={routeProps => (
                  <NewMoveOutBuilding
                    {...routeProps}
                    moveOutBuilding={moveOut ? moveOut : emptyMoveOutBuilding}
                    onChangeAndSave={moveOutBuilding => {
                      this.handleChange(moveOutBuilding, "moveOut")
                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/building/move-out")}
                  />
                )}
              />

              {/* Move-In */}
              <Route
                exact
                path={`${match.url}/building/move-in`}
                render={routeProps => (
                  <NewMoveInBuilding
                    {...routeProps}
                    moveInBuilding={moveIn ? moveIn : emptyMoveInBuilding}
                    onChangeAndSave={moveInBuilding => {
                      this.handleChange(moveInBuilding, "moveIn")
                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/building/move-in")}
                  />
                )}
              />

              {/* Storage */}
              <Route
                path={`${match.url}/building/storage`}
                render={routeProps => (
                  <StorageBuilding
                    {...routeProps}
                    data={storage ? storage : emptyStorageBuilding}
                    onChange={data => this.handleChange(data, "storage")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction("/building/storage")}
                  />
                )}
              />

              {/* Disposal */}
              <Route
                path={`${match.url}/building/disposal`}
                render={routeProps => (
                  <DisposalOutBuilding
                    {...routeProps}
                    data={disposal ? disposal : emptyDisposalOutBuilding}
                    onChange={data => this.handleChange(data, "disposal")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction("/building/disposal")}
                  />
                )}
              />

              {/* Cleaning */}
              <Route
                path={`${match.url}/building/cleaning`}
                render={routeProps => (
                  <CleaningBuilding
                    {...routeProps}
                    data={cleaning ? cleaning : emptyCleaningBuilding}
                    onChange={data => this.handleChange(data, "cleaning")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction("/building/cleaning")}
                  />
                )}
              />

              {/* E-Mail */}
              <Route
                path={`${match.url}/building/email-confirmation`}
                render={routeProps => (
                  <EmailConfirmation {...routeProps} save={this.Save} container={this.state} nextPage={match.url + this.nextPageFunction("/building/email-confirmation")} />
                )}
              />

              {/* Services */}
              <Route
                exact
                path={`${match.url}/services`}
                render={routeProps => (
                  <Services
                    {...routeProps}
                    data={services}
                    onChangeAndSave={serviceData => {
                      this.handleChange(serviceData, "services")
                      return LeadAPI.SaveServices(Lead.LeadId, serviceData)
                    }}
                    nextPage={this.redirectToNextPage("/services")}
                  />
                )}
              />

              {/* MoveService */}
              <Route
                exact
                path={`${match.url}/services/move`}
                render={routeProps => (
                  <MoveService
                    {...routeProps}
                    moveOut={moveOut}
                    moveIn={moveIn}
                    moveService={moveService ? moveService : emptyMoveService}
                    onChangeAndSave={(serviceData, moveIn, moveOut) => {
                      this.handleChange(serviceData, "moveService")
                      this.handleChange(moveOut, "moveOut")
                      this.handleChange(moveIn, "moveIn")

                      return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveMoveIn(moveIn, Lead.LeadId), LeadAPI.SaveMoveService(Lead.LeadId, serviceData)])
                    }}
                    nextPage={this.redirectToNextPage("/services/move")}
                  />
                )}
              />

              {/* MoveShop */}
              <Route
                exact
                path={`${match.url}/services/move/material-shop`}
                render={routeProps => (
                  <MaterialShop
                    {...routeProps}
                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={materialOrder => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Move}
                    nextPage={this.redirectToNextPage("/services/move/material-shop")}
                  />
                )}
              />

              {/* Move Inventory */}
              <Route
                exact
                path={`${match.url}/services/move/inventory`}
                render={routeProps => (
                  <Inventory
                    {...routeProps}
                    inventory={inventory ? inventory : emptyInventory}
                    onChangeAndSave={inventory => {
                      this.handleChange(inventory, "inventory")

                      return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
                    }}
                    initalInventoryTypeKey={InventoryKeysEnum.Move}
                    nextPage={this.redirectToNextPage("/services/move/inventory")}
                  />
                )}
              />

              {/* PackService */}
              <Route
                exact
                path={`${match.url}/services/pack`}
                render={routeProps => (
                  <PackService
                    {...routeProps}
                    moveOut={moveOut}
                    packService={packService ? packService : emptyPackService}
                    HasMoveService={services.HasMoveServiceEnabled}
                    onChangeAndSave={(serviceData, moveOut) => {
                      this.handleChange(serviceData, "packService")
                      this.handleChange(moveOut, "moveOut")

                      return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SavePackService(Lead.LeadId, serviceData)])
                    }}
                    nextPage={this.redirectToNextPage("/services/pack")}
                  />
                )}
              />

              {/* PackShop */}
              <Route
                exact
                path={`${match.url}/services/pack/material-shop`}
                render={routeProps => (
                  <MaterialShop
                    {...routeProps}
                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={materialOrder => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Pack}
                    nextPage={this.redirectToNextPage("/services/pack/material-shop")}
                  />
                )}
              />

              {/* StorageService */}
              <Route
                exact
                path={`${match.url}/services/storage`}
                render={routeProps => (
                  <StorageService
                    {...routeProps}
                    moveOut={moveOut}
                    moveIn={moveIn}
                    storageService={storageService ? storageService : emptyStorageService}
                    HasMoveService={services.HasMoveServiceEnabled}
                    onChangeAndSave={(serviceData, moveOut, moveIn) => {
                      this.handleChange(serviceData, "storageService")
                      this.handleChange(moveOut, "moveOut")
                      this.handleChange(moveIn, "moveIn")

                      return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveMoveIn(moveIn, Lead.LeadId), LeadAPI.SaveStorageService(Lead.LeadId, serviceData)])
                    }}
                    nextPage={this.redirectToNextPage("/services/storage")}
                  />
                )}
              />

              {/* StorageShop */}
              <Route
                exact
                path={`${match.url}/services/storage/material-shop`}
                render={routeProps => (
                  <MaterialShop
                    {...routeProps}
                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={materialOrder => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Storage}
                    nextPage={this.redirectToNextPage("/services/storage/material-shop")}
                  />
                )}
              />

              {/* Pack Inventory */}
              <Route
                exact
                path={`${match.url}/services/storage/inventory`}
                render={routeProps => (
                  <Inventory
                    {...routeProps}
                    inventory={inventory ? inventory : emptyInventory}
                    onChangeAndSave={inventory => {
                      this.handleChange(inventory, "inventory")

                      return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
                    }}
                    initalInventoryTypeKey={InventoryKeysEnum.Storage}
                    nextPage={this.redirectToNextPage("/services/storage/inventory")}
                  />
                )}
              />

              {/* Disposal */}
              <Route
                exact
                path={`${match.url}/services/disposal`}
                render={routeProps => (
                  <DisposalService
                    {...routeProps}
                    moveOut={moveOut}
                    disposalService={disposalService ? disposalService : emptyDisposalSerivce}
                    HasMoveService={services.HasMoveServiceEnabled}
                    onChangeAndSave={(serviceData, moveOut) => {
                      this.handleChange(serviceData, "disposalService")
                      this.handleChange(moveOut, "moveOut")

                      return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveDisposalService(Lead.LeadId, serviceData)])
                    }}
                    nextPage={this.redirectToNextPage("/services/disposal")}
                  />
                )}
              />

              {/* Disposal Inventory */}
              <Route
                exact
                path={`${match.url}/services/disposal/inventory`}
                render={routeProps => (
                  <Inventory
                    {...routeProps}
                    inventory={inventory ? inventory : emptyInventory}
                    onChangeAndSave={inventory => {
                      this.handleChange(inventory, "inventory")

                      return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
                    }}
                    initalInventoryTypeKey={InventoryKeysEnum.Disposal}
                    nextPage={this.redirectToNextPage("/services/disposal/inventory")}
                  />
                )}
              />

              {/* Disposal */}
              <Route
                exact
                path={`${match.url}/services/cleaning`}
                render={routeProps => (
                  <CleaningService
                    {...routeProps}
                    moveOut={moveOut}
                    cleaningService={cleaningService ? cleaningService : emptyCleaningService}
                    HasMoveService={services.HasMoveServiceEnabled}
                    onChangeAndSave={(serviceData, moveOut) => {
                      this.handleChange(serviceData, "cleaningService")
                      this.handleChange(moveOut, "moveOut")

                      return Promise.all([LeadAPI.SaveMoveOut(moveOut, Lead.LeadId), LeadAPI.SaveCleaningService(Lead.LeadId, serviceData)])
                    }}
                    nextPage={this.redirectToNextPage("/services/cleaning")}
                  />
                )}
              />

              <Route exact path={`${match.url}/conditions`}>
                {/* Previous page is one before so next gets calculated */}
                <Redirect to={match.url + this.nextPageFunction("/services/cleaning")} />
              </Route>

              {/* Conditions */}
              <Route
                exact
                path={`${match.url}/conditions/move`}
                render={routeProps => (
                  <MoveConditions
                    {...routeProps}
                    moveConditions={Lead.MoveServiceConditions ? Lead.MoveServiceConditions : emptyMoveServiceConditions}
                    onChangeAndSave={moveConditions => {
                      const newLead = { ...Lead, MoveServiceConditions: moveConditions }
                      this.handleChange(newLead, "Lead")

                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/conditions/move")}
                  />
                )}
              />

              {/* Conditions */}
              <Route
                exact
                path={`${match.url}/conditions/pack`}
                render={routeProps => (
                  <PackConditions
                    {...routeProps}
                    packConditions={Lead.PackServiceConditions ? Lead.PackServiceConditions : emptyPackServiceConditions}
                    onChangeAndSave={packConditions => {
                      const newLead = { ...Lead, PackServiceConditions: packConditions }
                      this.handleChange(newLead, "Lead")

                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/conditions/pack")}
                  />
                )}
              />

              {/* Conditions */}
              <Route
                exact
                path={`${match.url}/conditions/storage`}
                render={routeProps => (
                  <StorageConditions
                    {...routeProps}
                    storageConditions={Lead.StorageServiceConditions ? Lead.StorageServiceConditions : emptyStorageServiceConditions}
                    onChangeAndSave={storageConditions => {
                      const newLead = { ...Lead, StorageServiceConditions: storageConditions }
                      this.handleChange(newLead, "Lead")

                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/conditions/storage")}
                  />
                )}
              />

              {/* Conditions */}
              <Route
                exact
                path={`${match.url}/conditions/disposal`}
                render={routeProps => (
                  <DisposalConditions
                    {...routeProps}
                    disposalConditions={Lead.DisposalServiceConditions ? Lead.DisposalServiceConditions : emptyDisposalServiceConditions}
                    onChangeAndSave={disposalConditions => {
                      const newLead = { ...Lead, DisposalServiceConditions: disposalConditions }
                      this.handleChange(newLead, "Lead")

                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/conditions/disposal")}
                  />
                )}
              />

              {/* Conditions */}
              <Route
                exact
                path={`${match.url}/conditions/cleaning`}
                render={routeProps => (
                  <CleaningConditions
                    {...routeProps}
                    cleaningConditions={Lead.CleaningServiceConditions ? Lead.CleaningServiceConditions : emptyCleaningServiceConditions}
                    onChangeAndSave={cleaningConditions => {
                      const newLead = { ...Lead, CleaningServiceConditions: cleaningConditions }
                      this.handleChange(newLead, "Lead")

                      return Promise.all([this.Save()])
                    }}
                    nextPage={this.redirectToNextPage("/conditions/cleaning")}
                  />
                )}
              />

              {/* Offer */}
              <Route exact path={`${match.url}/offer`}>
                <Redirect to={`${match.url}/offer/generate`} />
              </Route>

              <Route exact path={`${match.url}/offer/generate`} render={routeProps => <Generate {...routeProps} nextPage={this.redirectToNextPage("/offer/generate")} />} />

              <Route exact path={`${match.url}/offer/preview`} render={routeProps => <PreviewOffer {...routeProps} nextPage={this.redirectToNextPage("/offer/preview")} />} />
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

        {/* Navigation */}
        {portal
          ? ReactDOM.createPortal(
              <>
                <ListSubheader>
                  <FormattedMessage id="EDIT_LEAD" />
                </ListSubheader>
                <NavFolder to={`${match.url}/building`} title="CUSTOMER">
                  {Lead ? (
                    <>
                      <Collapse in={Lead.HasMoveOutBuilding}>
                        <NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested />
                      </Collapse>
                      <Collapse in={Lead.HasMoveInBuilding}>
                        <NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested />
                      </Collapse>
                      <Collapse in={Lead.HasStorageInBuilding}>
                        <NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested />
                      </Collapse>
                      <Collapse in={Lead.HasDisposalOutBuilding}>
                        <NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested />
                      </Collapse>
                      <Collapse in={Lead.HasCleaningBuilding}>
                        <NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested />
                      </Collapse>
                      <NavItem to={`${match.url}/building/email-confirmation`} title="EMAIL_CONFIRMATION" nested />
                    </>
                  ) : null}
                </NavFolder>

                <NavFolder to={`${match.url}/services`} title="SERVICES">
                  <Collapse in={services.HasMoveServiceEnabled}>
                    <NavFolder to={`${match.url}/services/move`} title="MOVE" nested>
                      <NavItem to={`${match.url}/services/move/material-shop`} title="MATERIAL_SHOP" doubleNested />
                      <NavItem to={`${match.url}/services/move/inventory`} title="INVENTORY" doubleNested />
                    </NavFolder>
                  </Collapse>

                  <Collapse in={services.HasPackServiceEnabled}>
                    <NavFolder to={`${match.url}/services/pack`} title="PACK" nested>
                      <NavItem to={`${match.url}/services/pack/material-shop`} title="MATERIAL_SHOP" doubleNested />
                    </NavFolder>
                  </Collapse>

                  <Collapse in={services.HasStorageServiceEnabled}>
                    <NavFolder to={`${match.url}/services/storage`} title="STORAGE" nested>
                      <NavItem to={`${match.url}/services/storage/material-shop`} title="MATERIAL_SHOP" doubleNested />
                      <NavItem to={`${match.url}/services/storage/inventory`} title="INVENTORY" doubleNested />
                    </NavFolder>
                  </Collapse>

                  <Collapse in={services.HasDisposalServiceEnabled}>
                    <NavFolder to={`${match.url}/services/disposal`} title="DISPOSAL" nested>
                      <NavItem to={`${match.url}/services/disposal/inventory`} title="INVENTORY" doubleNested />
                    </NavFolder>
                  </Collapse>

                  <Collapse in={services.HasCleaningServiceEnabled}>
                    <NavItem to={`${match.url}/services/cleaning`} title="CLEANING" nested />
                  </Collapse>
                </NavFolder>

                <NavFolder to={`${match.url}/conditions`} title="CONDITIONS">
                  <Collapse in={services.HasCleaningServiceEnabled}>
                    <NavItem to={`${match.url}/conditions/move`} title="MOVE_CONDITIONS" nested />
                  </Collapse>

                  <Collapse in={services.HasPackServiceEnabled}>
                    <NavItem to={`${match.url}/conditions/pack`} title="PACK_CONDITIONS" nested />
                  </Collapse>

                  <Collapse in={services.HasStorageServiceEnabled}>
                    <NavItem to={`${match.url}/conditions/storage`} title="STORAGE_CONDITIONS" nested />
                  </Collapse>

                  <Collapse in={services.HasDisposalServiceEnabled}>
                    <NavItem to={`${match.url}/conditions/disposal`} title="DISPOSAL_CONDITIONS" nested />
                  </Collapse>

                  <Collapse in={services.HasCleaningServiceEnabled}>
                    <NavItem to={`${match.url}/conditions/cleaning`} title="CLEANING_CONDITIONS" nested />
                  </Collapse>
                </NavFolder>

                <NavFolder to={`${match.url}/offer`} title="OFFER">
                  <Collapse in={services.HasCleaningServiceEnabled}>
                    <NavItem to={`${match.url}/offer/generate`} title="GENERATE" nested />
                  </Collapse>

                  <Collapse in={services.HasPackServiceEnabled}>
                    <NavItem to={`${match.url}/offer/preview`} title="PREVIEW" nested />
                  </Collapse>
                </NavFolder>
              </>,
              portal
            )
          : null}
        <SuccessSnackbar message="Error Occured" open={errorOccured} onClose={this.closeError} />
      </>
    )
  }
}

export default withResource(Lead)

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
import LeadAPI, { ILeadContainer, emptyLeadContainer, checkIs } from './LeadAPI';
import { emptyLead, ILead } from '../interfaces/ILead';
import Services from './Services';
import { withResource, WithResourceProps } from '../providers/withResource';
import NavFolder from '../components/Navigation/NavFolder';
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from '../interfaces/IBuilding';
import SuccessSnackbar from '../components/SuccessSnackbar';
import MoveService from './Services/MoveService';
import { emptyMoveService } from '../interfaces/IService';
import MaterialShop from './Services/MaterialShop';
import { ShopTypeEnum, emptyMaterialOrder } from '../interfaces/IShop';
import Inventory from './Services/Inventory';
import { InventoryKeysEnum, emptyInventory } from '../interfaces/IInventars';

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

  nextPageFunction = (current: string) => {
    // Check if lead is even defined
    if (this.state.Lead) {
      const { HasMoveInBuilding, HasMoveOutBuilding, HasDisposalOutBuilding, HasStorageInBuilding, HasCleaningBuilding } = this.state.Lead

      const order = [
        { name: '/building', active: true },
        { name: '/building/move-out', active: HasMoveInBuilding },
        { name: '/building/move-in', active: HasMoveOutBuilding },
        { name: '/building/storage', active: HasDisposalOutBuilding },
        { name: '/building/disposal', active: HasStorageInBuilding },
        { name: '/building/cleaning', active: HasCleaningBuilding },
        { name: '/building/email-confirmation', active: true },
        { name: '/services', active: true },
        { name: '/services/move', active: true },
        { name: '/services/move/material-shop', active: true },
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
            this.props.match.params.id !== "new" && Lead != null && checkIs<ILead>(Lead, "LeadId") ?
            <>

              {/* Customer */}
              <Route
                exact
                path={`${match.url}/building`}
                render={(routeProps) =>
                  <Customer
                    {...routeProps}
                    data={Lead}
                    onChange={(data) => this.handleChange(data, "Lead")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building')}
                  />
                }
              />

              {/* Move-Out */}
              <Route
                path={`${match.url}/building/move-out`}
                render={(routeProps) =>
                  <MoveOutBuilding
                    {...routeProps}
                    data={moveOut ? moveOut : emptyMoveOutBuilding}
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
                    data={moveIn ? moveIn : emptyMoveInBuilding}
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
                    data={storage ? storage : emptyStorageBuilding}
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
                    data={disposal ? disposal : emptyDisposalOutBuilding}
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
                    data={cleaning ? cleaning : emptyCleaningBuilding}
                    onChange={(data) => this.handleChange(data, "cleaning")}
                    save={this.Save}
                    nextPage={match.url + this.nextPageFunction('/building/cleaning')}
                  />
                }
              />

              {/* E-Mail */}
              <Route
                path={`${match.url}/building/email-confirmation`}
                render={(routeProps) =>
                  <EmailConfirmation
                    {...routeProps}
                    save={this.Save}
                    container={this.state}
                    nextPage={match.url + this.nextPageFunction('/building/email-confirmation')}
                  />
                }
              />

              {/* Services */}
              <Route
                exact
                path={`${match.url}/services`}
                render={(routeProps) =>
                  <Services
                    {...routeProps}
                    data={services}
                    onChangeAndSave={(serviceData) => { this.handleChange(serviceData, "services"); return LeadAPI.SaveServices(Lead.LeadId, serviceData)}}
                    // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />

              {/* MoveService */}
              <Route
                exact
                path={`${match.url}/services/move`}
                render={(routeProps) =>
                  <MoveService
                    {...routeProps}

                    moveOut={moveOut}
                    moveIn={moveIn}
                    moveService={moveService ? moveService : emptyMoveService}

                    onChangeAndSave={(serviceData, moveIn, moveOut) => {
                      this.handleChange(serviceData, "services");
                      this.handleChange(moveOut, "moveOut");
                      this.handleChange(moveIn, "moveIn");

                      return Promise.all([
                        LeadAPI.SaveMoveOut(moveOut, Lead.LeadId),
                        LeadAPI.SaveMoveIn(moveIn, Lead.LeadId),
                        LeadAPI.SaveMoveService(Lead.LeadId, serviceData),
                      ])
                    }}
                    // data={}
                    // container={this.state}
                    // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />

              {/* MoveShop */}
              <Route
                exact
                path={`${match.url}/services/move/material-shop`}
                render={(routeProps) =>
                  <MaterialShop
                    {...routeProps}

                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={(materialOrder) => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Move}
                  // data={}
                  // container={this.state}
                  // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />

              {/* Move Inventory */}
              <Route
                exact
                path={`${match.url}/services/move/inventory`}
                render={(routeProps) =>
                  <Inventory
                    {...routeProps}

                    inventory={inventory ? inventory : emptyInventory}
                    onChangeAndSave={(inventory) => {
                      this.handleChange(inventory, "inventory")

                      return LeadAPI.SaveInventoryService(Lead.LeadId, inventory)
                    }}
                    initalInventoryTypeKey={InventoryKeysEnum.Move}
                  // data={}
                  // container={this.state}
                  // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />


              {/* PackShop */}
              <Route
                exact
                path={`${match.url}/services/pack/material-shop`}
                render={(routeProps) =>
                  <MaterialShop
                    {...routeProps}

                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={(materialOrder) => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Pack}
                  // data={}
                  // container={this.state}
                  // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />


              {/* StorageShop */}
              <Route
                exact
                path={`${match.url}/services/storage/material-shop`}
                render={(routeProps) =>
                  <MaterialShop
                    {...routeProps}

                    materialOrder={materialOrder ? materialOrder : emptyMaterialOrder}
                    onChangeAndSave={(materialOrder) => {
                      this.handleChange(materialOrder, "materialOrder")

                      return LeadAPI.SaveMaterialOrderService(Lead.LeadId, materialOrder)
                    }}
                    shopTypeKey={ShopTypeEnum.Storage}
                  // data={}
                  // container={this.state}
                  // nextPage={match.url + this.nextPageFunction('/service/move-service')}
                  />
                }
              />
            </>
            :
              Lead ? (
              <Route
                exact
                path={`${match.url}/building`}
                render={(routeProps) =>
                  <Customer
                    {...routeProps}
                    data={Lead}
                    onChange={(data) => this.handleChange(data, "Lead")}
                    save={this.Create}
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
          <NavFolder to={`${match.url}/building`} title="CUSTOMER">
            {Lead ? (
              <>
                <Collapse in={Lead.HasMoveOutBuilding}><NavItem to={`${match.url}/building/move-out`} title="MOVE_OUT_BUILDING" nested/></Collapse>
                <Collapse in={Lead.HasMoveInBuilding}><NavItem to={`${match.url}/building/move-in`} title="MOVE_IN_BUILDING" nested/></Collapse>
                <Collapse in={Lead.HasStorageInBuilding}><NavItem to={`${match.url}/building/storage`} title="STORAGE_BUILDING" nested/></Collapse>
                <Collapse in={Lead.HasDisposalOutBuilding}><NavItem to={`${match.url}/building/disposal`} title="DISPOSAL_BUILDING" nested/></Collapse>
                <Collapse in={Lead.HasCleaningBuilding}><NavItem to={`${match.url}/building/cleaning`} title="CLEANING_BUILDING" nested/></Collapse>
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
              </NavFolder>
            </Collapse>

            <Collapse in={services.HasDisposalServiceEnabled}>
              <NavFolder to={`${match.url}/services/disposal`} title="DISPOSAL" nested>
              </NavFolder>
            </Collapse>

            <Collapse in={services.HasCleaningServiceEnabled}>
              <NavFolder to={`${match.url}/services/cleaning`} title="CLEANING" nested>
              </NavFolder>
            </Collapse>

          </NavFolder>
        </>, portal) : null}
        <SuccessSnackbar message="Error Occured" open={errorOccured} onClose={this.closeError}   />
      </>
    )
  }
}

export default withResource(Lead)

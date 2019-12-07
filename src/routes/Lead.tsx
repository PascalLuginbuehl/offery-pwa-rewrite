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
import LeadAPI, { ILeadContainer } from './LeadAPI';
import { emptyLead, ILead, IPostLead } from '../interfaces/ILead';
import Services from './Services';
import { withResource, WithResourceProps } from '../providers/withResource';
import NavFolder from '../components/Navigation/NavFolder';
import { emptyMoveOutBuilding, emptyMoveInBuilding, emptyStorageBuilding, emptyDisposalOutBuilding, emptyCleaningBuilding } from '../interfaces/IBuilding';
import SuccessSnackbar from '../components/SuccessSnackbar';
import MoveService from './Services/MoveService';
import { emptyMoveService, emptyPackService, emptyStorageService, emptyDisposalService, emptyCleaningService, emptyServices } from '../interfaces/IService';
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
import LeadPageOrder from './CombinedRoutes/LeadPageOrder';
import { thisExpression } from '@babel/types';
import BuildingRoutes from './CombinedRoutes/BuildingRoutes';
interface State {
  container: ILeadContainer | null

  initialAwait: Promise<any> | null
}

interface Props extends RouteComponentProps<{ id?: string }>, WithResourceProps {
  portal: HTMLDivElement | null
  closeNavigation: () => void
}


class Lead extends Component<Props, State> {
  state: State = {
    container: null,

    initialAwait: null,
  }

  componentDidUpdate(prevProps: Props) {
    // Close Navigation on Navigate
    if (this.props.location !== prevProps.location) {
      this.props.closeNavigation()
    }
  }

  public handleChange = (value: any, target: keyof ILeadContainer) => {
    const {container} = this.state
    if(container) {
      this.setState({ container: {...container, [target]: value} })
    }
  }

  async componentDidMount() {
    const fetch =  async () => {
      const idString = this.props.match.params.id
      const potentialLeadId = parseInt(idString ? idString : "")

      if (idString === "new") {
        // Do nothing if sting new
        return
      } else if (!isNaN(potentialLeadId)) {
        const offline = await LeadAPI.FetchFromOffline(potentialLeadId)

        if (offline && offline.onlySavedOffline) {
          // Save to online and then fetch

          await this.saveOfflineToOnline(potentialLeadId, offline)
        } else {
          await this.loadFromOnline(potentialLeadId)

          this.setState({})
        }
      } else {
        console.log("Is not a leadId", potentialLeadId)
      }
    }

    this.setState({ initialAwait: fetch() })
  }

  saveOfflineToOnline = async (potentialLeadId: number, offlineLead: ILeadContainer) => {
    try {
      await LeadAPI.SaveToApi(potentialLeadId, offlineLead)

      try {
        await this.loadFromOnline(potentialLeadId)
      } catch (e) {
        console.log("Saving success but loading failed")
        console.dir(e)

        this.setState({ container: offlineLead })
      }
    } catch (e) {
      if (e.message == "Failed to fetch") {
        console.log("Still not online to reupload")

        this.setState({ container: offlineLead })
      }
    }
  }

  loadFromOnline(potentialLeadId: number) {
    return new Promise(async (resolve, reject) => {
      try {
        const promiseOnline = LeadAPI.FetchFromOnline(potentialLeadId)

        const lead = await promiseOnline

        this.setState({ container: lead })

        await LeadAPI.SaveToOffline(potentialLeadId, lead)

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }

  redirectToNextPage = (currentPage: string) => () => {
    const { container } = this.state
    if (container) {
      const { Lead } = container

      const { history } = this.props

      const nextPage = this.nextPageFunction(currentPage)

      // Quickfix due to TS Lint error
      history.push("/lead/" + (Lead as ILead).LeadId + nextPage)
    }
  }

  nextPageFunction = (current: string): string => {
    const { container } = this.state

    // Check if lead is even defined
    if (container) {
      const order = LeadPageOrder(container.Lead, container.services)

      let lastPage = { name: "" }
      for (let index = 0; index < order.length; index++) {
        const potentialNextPage = order[index]

        if (lastPage.name == current) {
          if (potentialNextPage.active) {
            return potentialNextPage.name
          }
        } else {
          lastPage = potentialNextPage
        }
      }
    }

    return ""
  }

  // Save = (): Promise<any> => {
  //   return (new Promise(async (resolve, reject) => {
  //     const { initialAwait, loadedFromOffline, ...lead} = this.state

  //     const { Lead } = lead
  //     if(LeadAPI.isCompleteLead(Lead)) {
  //       try {
  //         await LeadAPI.SaveToApi(Lead.LeadId, lead)
  //         resolve()

  //       } catch (e) {
  //         if (e.message == "Failed to fetch") {
  //           try {
  //             LeadAPI.SaveToOffline(Lead.LeadId, { ...lead, onlySavedOffline: true })
  //             this.setState({ onlySavedOffline: true })

  //             console.log("Saved to offline storage")
  //             resolve()

  //           } catch (e) {
  //             // Major upsie // TODO: Handle this
  //             console.log("Couldn't save offline", e)
  //             reject("Couldn't save offline")
  //           }
  //         } else if (e.message == "Could not save lead properly") {
  //           // Other type of error message
  //           console.log("I need ma own error popup m8")
  //           reject("Error while saving")
  //         } else {
  //           console.log("Unknown error:", e)
  //           reject(e)
  //         }
  //       }
  //     } else {
  //       console.log("Lead not yet created")
  //     }
  //   })
  //   .catch(e => {

  //     console.log("Well, there was a litte error happening while savin m8")

  //     throw Error("Not saved")
  //   }))
  // }

  createLead = async (createLead: IPostLead) => {
    const promise = LeadService.createCustomer(createLead, this.props.selectedCompany.CompanyId)

    try {
      const lead = await promise

      const container: ILeadContainer = {
        lastUpdated: new Date(),
        onlySavedOffline: false,
        cachedInVersion: "",

        Lead: lead,

        moveOut: null,
        moveIn: null,
        cleaning: null,
        disposal: null,
        storage: null,

        services: { LeadId: lead.LeadId, ...emptyServices },

        moveService: null,
        packService: null,
        storageService: null,
        disposalService: null,
        cleaningService: null,

        materialOrder: null,
        inventory: null,
      }

      this.setState({ container: container })

      this.props.history.replace("/lead/" + lead.LeadId + this.nextPageFunction("/building"))

      return
    } catch (e) {
      if (e.message == "Failed to fetch") {
        console.log("Cannot create from offline")
      } else {
        console.log("Couldn't create")
        console.dir(e)
      }
    }
  }

  public render() {
    const { initialAwait } = this.state
    const { match, portal } = this.props

    return (
      <>
        <Wrapper initialLoading={initialAwait}>
          {/* {onlySavedOffline ? (
            <IntlTooltip title="NOT_SAVED_ONLINE">
              <CloudUploadIcon color="error" />
            </IntlTooltip>
          ) : null}

          {loadedFromOffline ? (
            <IntlTooltip title="LOADED_FROM_CACHE">
              <OfflinePinIcon color="primary" />
            </IntlTooltip>
          ) : null} */}

          {this.renderLead()}
        </Wrapper>
      </>
    )
  }

  renderLead = () => {
    const { match } = this.props
    const { container } = this.state

    // Create New Lead
    if (match.params.id === "new" && container === null) {
      return (
        <NewCustomer
          lead={emptyLead}
          onChangeAndSave={lead => {
            return this.createLead(lead)
          }}
          nextPage={this.redirectToNextPage("/building")}
        />
      )
    } else if (container) {
      return <>
        <BuildingRoutes leadContainer={container} handleChange={this.handleChange} matchUrl={match.url} redirectToNextPage={this.redirectToNextPage} />

      </>
    } else {
      return "No Lead found"
    }
  }
}

export default withResource(Lead)

import {
  createStyles,
  Tab,
  Tabs,
  Theme,
  WithStyles,
  withStyles,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@material-ui/core"
import * as React from "react"
import { withResource, WithResourceProps } from "../../../providers/withResource"
import IntlTypography from "../../../components/Intl/IntlTypography"
import {  FormikProps, Field,   withFormik,  ArrayHelpers, FieldArray } from "formik"
import Form from "../../../components/FormikFields/Form"
import { IOrderPosition, CurrentlyOpenStateEnum, IMaterialOrder } from "../../../interfaces/IShop"
import { IProduct } from "../../../interfaces/IProduct"
import {  FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl"
import SelectGridItem from "../../../components/ShopElements/SelectGridItem"
import PageHeader from "../../../components/PageHeader"
import FormikDateTimePicker from "../../../components/FormikFields/FormikDateTimePicker"
import FormikPrice from "../../../components/Formik/CustomComponents/FormikPrice"
import { ILead } from "../../../interfaces/ILead"
import { MaterialShopRow } from "./MateriallShopRow"
import FormikTextField from "../../../components/FormikFields/FormikTextField"
import { StyledTableCell } from "../LeadOverview"

const styles = (theme: Theme) => createStyles({})

type Values = IMaterialOrder & { lead: ILead }

interface Props extends WithResourceProps, WithStyles<typeof styles>, WrappedComponentProps {
  onChangeAndSave: (data: IMaterialOrder, lead: ILead) => Promise<any>
  materialOrder: IMaterialOrder
  lead: ILead
  nextPage: () => void
}

interface State {
  currentlyOpen: CurrentlyOpenStateEnum
}

// Ugly fix so i don't have to rewrite this whole component
class MaterialShop extends React.Component<Props & FormikProps<Values>, State> {
  state: State = {
    currentlyOpen: this.getDefaultCurrentlyOpen(),
  }

  getDefaultCurrentlyOpen(): CurrentlyOpenStateEnum {
    const { selectedCompany } = this.props

    if (selectedCompany.Settings.EnableMaterialOrderRent) {
      return CurrentlyOpenStateEnum.Rent
    }

    if (selectedCompany.Settings.EnableMaterialOrderBuy ) {
      return CurrentlyOpenStateEnum.Buy
    }

    return CurrentlyOpenStateEnum.Free
  }

  addItemToList = (product: IProduct, amount: number) => {
    const { handleChange, values } = this.props
    const { currentlyOpen } = this.state

    let items = values.OrderPositions

    // Merge item with new Products
    let itemNotInList = true
    items = items.map(item => {
      if (
        item.ProductId == product.ProductId &&
        item.IsForFree == (CurrentlyOpenStateEnum.Free == currentlyOpen) &&
        item.IsRent == (CurrentlyOpenStateEnum.Rent == currentlyOpen)
      ) {
        itemNotInList = false
        return { ...item, Amount: item.Amount + amount }
      } else {
        return item
      }
    })

    if (itemNotInList) {
      const order: IOrderPosition = {
        Amount: 1,
        IsForFree: currentlyOpen == CurrentlyOpenStateEnum.Free,
        IsRent: currentlyOpen == CurrentlyOpenStateEnum.Rent,
        ProductId: product.ProductId,
      }

      items.push(order)
    }

    handleChange({ target: { value: items, name: "OrderPositions" } })
  }

  getCorrespondingProduct = (order: IOrderPosition): IProduct => {
    const products = this.props.selectedCompany.ShopProducts

    const foundProduct = products.find(product => product.ProductId == order.ProductId)
    if (foundProduct) {
      return foundProduct
    } else {
      throw new Error("Product u r looking for not found")
    }
  }

  filterShowList = (currentlyOpen: CurrentlyOpenStateEnum) => (item: IOrderPosition) => {
    if (
      (currentlyOpen == CurrentlyOpenStateEnum.Rent && item.IsRent) ||
      (currentlyOpen == CurrentlyOpenStateEnum.Free && item.IsForFree) ||
      (currentlyOpen == CurrentlyOpenStateEnum.Buy && !item.IsForFree && !item.IsRent)
    ) {
      return true
    }

    return false
  }

  handleTabChange = (e: React.ChangeEvent<{}>, value: CurrentlyOpenStateEnum) => {
    this.setState({ currentlyOpen: value })
  }

  public render() {
    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status, resource, selectedCompany, intl } = this.props

    const selectedItemList = values.OrderPositions

    const itemCountBuy = selectedItemList.filter(this.filterShowList(CurrentlyOpenStateEnum.Buy)).length
    const itemCountFree = selectedItemList.filter(this.filterShowList(CurrentlyOpenStateEnum.Free)).length
    const itemCountRent = selectedItemList.filter(this.filterShowList(CurrentlyOpenStateEnum.Rent)).length

    const { currentlyOpen } = this.state
    const ShopProducts = selectedCompany.ShopProducts

    const initialDate = new Date()
    initialDate.setHours(selectedCompany.Settings.DefaultServiceTimeStart || 8)
    initialDate.setMinutes(0)
    initialDate.setSeconds(0)

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MATERIAL_SHOP" />
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {ShopProducts.map((product, index) => (
                <SelectGridItem product={product} onSelectProduct={amount => this.addItemToList(product, amount)} key={index} currentlyOpenState={currentlyOpen} />
              ))}
            </Grid>
          </Grid>

          <Grid item xs={6} md={3}>
            <FormikPrice label={intl.formatMessage({id: "FIX_DELIVERY_COST"})} name="DeliveryCostFix" />
          </Grid>

          {selectedCompany.Settings.EnableMaterialOrderDelivery ? (<Field name="lead.DeliveryDate" label="PACKING_DELIVERY_DATE" component={FormikDateTimePicker} initialFocusedDate={initialDate}/>) : null }

          {selectedCompany.Settings.EnableMaterialOrderDelivery ? (<Field name="lead.CollectBackDate" label="COLLECTBACKDATE" component={FormikDateTimePicker} initialFocusedDate={initialDate} />) : null}

          {selectedCompany.Settings.EnableMaterialOrderComment ? (<Field name="Comment" label="COMMENT" component={FormikTextField} multiline overrideGrid={{ xs: 12 }} />) : null }

          <Grid item xs={12}>
            <Tabs value={currentlyOpen} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" centered>
              {selectedCompany.Settings.EnableMaterialOrderBuy ? (<Tab label={<Typography variant="subtitle2">{intl.formatMessage({ id: "BUY" })} <Chip label={itemCountBuy} size="small" /></Typography>} value={CurrentlyOpenStateEnum.Buy} />) : null }
              {selectedCompany.Settings.EnableMaterialOrderRent ? (<Tab label={<Typography variant="subtitle2">{intl.formatMessage({ id: "RENT" })} <Chip label={itemCountRent} size="small" /></Typography>} value={CurrentlyOpenStateEnum.Rent} />) : null }
              {selectedCompany.Settings.EnableMaterialOrderFree ? (<Tab label={<Typography variant="subtitle2">{intl.formatMessage({ id: "INCLUSIVE" })} <Chip label={itemCountFree} size="small" /></Typography>} value={CurrentlyOpenStateEnum.Free} />) : null }
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <FieldArray
              name={"OrderPositions"}
              render={(arrayHelpers: ArrayHelpers) => (
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell padding="checkbox">
                        <FormattedMessage id="ITEM" />
                      </StyledTableCell>
                      <StyledTableCell align="right" padding="checkbox">
                        <FormattedMessage id="QUANTITY" />
                      </StyledTableCell>
                      <StyledTableCell align="right" padding="checkbox">
                        <FormattedMessage id="PRICE" />
                      </StyledTableCell>
                      <StyledTableCell align="center" padding="checkbox">
                        <FormattedMessage id="ACTIONS" />
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedItemList && selectedItemList.length > 0 ? (
                      selectedItemList
                        .map((item, index) => ({ originalIndex: index, ...item }))
                        .filter(this.filterShowList(currentlyOpen))
                        .map(item => {
                          const product = this.getCorrespondingProduct(item)

                          return <MaterialShopRow key={item.originalIndex} product={product} item={item} arrayHelpers={arrayHelpers} currentlyOpen={currentlyOpen}/>
                        })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <IntlTypography>EMPTY</IntlTypography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            />
          </Grid>
        </Form>
      </Grid>
    )
  }

  displayOtherShopValues = (itemOrders: IOrderPosition[]) => {
    const { intl } = this.props

    const rentItems = itemOrders.filter(item => item.IsRent)
    const freeItems = itemOrders.filter(item => item.IsForFree)
    const buyItems = itemOrders.filter(item => !item.IsRent && !item.IsForFree)

    const mapItems = (items: IOrderPosition[]): string => {
      return items
        .map(item => {
          const product = this.getCorrespondingProduct(item)
          return item.Amount + "x " + intl.formatMessage({ id: product.NameTextKey })
        })
        .join(", ")
    }
    return [
      buyItems.length > 0 ? intl.formatMessage({ id: "BUY" }) + ": " + mapItems(buyItems) : undefined,
      rentItems.length > 0 ? intl.formatMessage({ id: "RENT" }) + ": " + mapItems(rentItems) : undefined,
      freeItems.length > 0 ? intl.formatMessage({ id: "INCLUSIVE" }) + ": " + mapItems(freeItems) : undefined,
    ]
      .filter(e => !!e)
      .join(" ")
  }
}

export default injectIntl(
  withStyles(styles, { name: "MoveShop" })(
    withResource(
      withFormik<Props, Values>({
        mapPropsToValues: props => ({ ...props.materialOrder, lead: props.lead }),

        handleSubmit: async (values, actions) => {
          try {
            const { lead, ...material } = values
            await actions.props.onChangeAndSave(material, lead)

            actions.setSubmitting(false)

            actions.resetForm()
            actions.props.nextPage()
          } catch (e) {
            actions.setStatus(e)
          }
        },
      })(MaterialShop)
    )
  )
)

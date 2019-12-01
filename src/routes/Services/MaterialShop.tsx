import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, ButtonBase, Paper, IconButton, TextField as MuiTextfield  } from '@material-ui/core'
import * as React from 'react'
import { withResource, WithResourceProps } from '../../providers/withResource';
import IntlTypography from '../../components/Intl/IntlTypography';
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, ArrayHelpers, FieldArray } from 'formik';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/FormikDatePicker';
import { IOrderPosition, CurrentlyOpenStateEnum, IMaterialOrder, ShopTypeEnum } from '../../interfaces/IShop';
import { IProduct } from '../../interfaces/IProduct';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { FormattedNumber, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import SelectGridItem from '../../components/ShopElements/SelectGridItem';
import PageHeader from '../../components/PageHeader';
import FormikDateTimePicker from '../../components/FormikFields/FormikDateTimePicker';
import FormikPrice from '../../components/FormikFields/Numbers/FormikPrice';


const styles = (theme: Theme) =>
  createStyles({

  })



interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  onChangeAndSave: (data: IMaterialOrder) => void,
  shopTypeKey: ShopTypeEnum,
  materialOrder: IMaterialOrder,
  nextPage: () => void
}

interface State {
  currentlyOpen: CurrentlyOpenStateEnum
}

class MaterialShop extends React.Component<Props & FormikProps<IMaterialOrder>, State> {

  state: State = {
    currentlyOpen: CurrentlyOpenStateEnum.Buy,
  }

  addItemToList = (product: IProduct) => {
    const { handleChange, values, shopTypeKey } = this.props
    const { currentlyOpen } = this.state

    let items = this.getSelectedList()

    // Merge item with new Products
    let itemNotInList = true
    items = items.map(item => {
      if(
        item.ProductId == product.ProductId
        &&
        item.IsForFree == (CurrentlyOpenStateEnum.Free == currentlyOpen)
        &&
        item.IsRent == (CurrentlyOpenStateEnum.Rent == currentlyOpen)
      ) {
        itemNotInList = false
        return { ...item, Amount: item.Amount + 1}
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

    handleChange({ target: { value: items, name: shopTypeKey } })
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

  removeOneItem = (index: number) => {
    const { handleChange, values, shopTypeKey } = this.props
    let items = this.getSelectedList()

    const newItems = [...items.map((item, itemIndex) => {
      if (index == itemIndex) {
        return {
          ...item,
          Amount: item.Amount - 1,
        }
      }

      return item
    })]
    // Filter for Amount 0
    .filter(item => item.Amount > 0)

    handleChange({ target: { value: newItems, name: shopTypeKey } })
  }

  filterShowList = (currentlyOpen: CurrentlyOpenStateEnum) => (item: IOrderPosition) => {
    if (
      (currentlyOpen == CurrentlyOpenStateEnum.Rent && item.IsRent)
        ||
      (currentlyOpen == CurrentlyOpenStateEnum.Free && item.IsForFree)
        ||
      (currentlyOpen == CurrentlyOpenStateEnum.Buy && !item.IsForFree && !item.IsRent)
    ) {
      return true
    }

    return false
  }

  handleTabChange = (e: React.ChangeEvent<{}>, value: CurrentlyOpenStateEnum) => {
    this.setState({currentlyOpen: value})
  }

  getSelectedList = (): IOrderPosition[] => {
    const { shopTypeKey, values} = this.props

    return values[shopTypeKey]
  }

  public render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      status,
      resource,
      selectedCompany,
      intl,
      shopTypeKey
    } = this.props


    const selectedItemList = this.getSelectedList()

    const { currentlyOpen } = this.state
    const ShopProducts = selectedCompany.ShopProducts

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="MATERIAL_SHOP" />
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {ShopProducts.map((product, index) => (
                <SelectGridItem product={product} onSelectProduct={amount => this.addItemToList(product)} key={index} currentlyOpenState={currentlyOpen} />
              ))}
            </Grid>
          </Grid>

          <Field name="DeliveryCostFix" label="FIX_DELIVERY_COST" component={FormikPrice} />
          <Field name="DeliveryDate" label="PACKING_DELIVERY_DATE" component={FormikDateTimePicker} />

          <Grid item xs={12}>
            <Tabs value={currentlyOpen} onChange={this.handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" centered>
              <Tab label={intl.formatMessage({ id: "BUY" })} value={CurrentlyOpenStateEnum.Buy} />
              <Tab label={intl.formatMessage({ id: "RENT" })} value={CurrentlyOpenStateEnum.Rent} />
              <Tab label={intl.formatMessage({ id: "INCLUSIVE" })} value={CurrentlyOpenStateEnum.Free} />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <FieldArray
              name={shopTypeKey}
              render={(arrayHelpers: ArrayHelpers) => (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <FormattedMessage id="ITEM" />
                      </TableCell>
                      <TableCell align="right" padding="checkbox">
                        <FormattedMessage id="QUANTITY" />
                      </TableCell>
                      <TableCell align="right" padding="checkbox">
                        <FormattedMessage id="PRICE" />
                      </TableCell>
                      <TableCell align="center" padding="checkbox">
                        <FormattedMessage id="ACTIONS" />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedItemList && selectedItemList.length > 0 ? (
                      selectedItemList
                        .map((item, index) => ({ originalIndex: index, ...item }))
                        .filter(this.filterShowList(currentlyOpen))
                        .map(item => {
                          const product = this.getCorrespondingProduct(item)
                          return (
                            <TableRow key={item.originalIndex}>
                              <TableCell>
                                <FormattedMessage id={product.NameTextKey} />
                              </TableCell>
                              <TableCell align="right">{item.Amount} Stk.</TableCell>
                              <TableCell align="right">
                                {currentlyOpen != CurrentlyOpenStateEnum.Free ? (
                                  <FormattedNumber
                                    value={(currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice) * item.Amount}
                                    style="currency"
                                    currency="CHF"
                                  />
                                ) : (
                                  "-"
                                )}
                              </TableCell>

                              <TableCell padding="none" align="center" style={{ whiteSpace: "nowrap" }}>
                                <IconButton onClick={() => this.removeOneItem(item.originalIndex)}>
                                  <RemoveCircleOutlineIcon />
                                </IconButton>

                                <IconButton onClick={() => arrayHelpers.remove(item.originalIndex)}>
                                  <DeleteForeverIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                    ) : (
                      <TableRow>
                        <TableCell rowSpan={10} colSpan={5} align="center">
                          <IntlTypography>EMPTY</IntlTypography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            />
          </Grid>
          {status && status.msg && <div>{status.msg}</div>}
          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default
injectIntl(
  withStyles(styles, {name: "MoveShop"})(
    withResource(
      withFormik<Props, IMaterialOrder>({
        validationSchema: Yup.object().shape({
          // email: Yup.string()
          //   .email()
          //   .required(),
        }),

        mapPropsToValues: props => props.materialOrder,

        handleSubmit: async (values, actions) => {
          await actions.props.onChangeAndSave(values)

          actions.setSubmitting(false)
          actions.props.nextPage()
        }

      })(MaterialShop)
    )
  )
)

import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, ButtonBase, Paper, IconButton, TextField as MuiTextfield  } from '@material-ui/core'
import ResponsiveContainer from '../../components/ResponsiveContainer'
// import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import CounterTable, { Cart } from '../../components/ShopElements/CounterTable'
import GridSelect, { GridSelectItem } from '../../components/ShopElements/GridSelect'
import * as React from 'react'
import BigCheckbox from '../../components/Validator/BigCheckbox';
import { withResource, WithResourceProps } from '../../providers/withResource';
import { IPostMoveInBuilding, IPostMoveOutBuilding } from '../../interfaces/IBuilding';
import IntlTypography from '../../components/Intl/IntlTypography';
import ValidatedDatePicker from '../../components/Validator/ValidatedDatePicker';
// import TestService from 'services/TestService'
import { Formik, FormikActions, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, ArrayHelpers, FieldArray } from 'formik';
import TextField from '../../components/FormikFields/TextField';
import Switch from '../../components/FormikFields/Switch';
import * as Yup from 'yup'
import Form from '../../components/FormikFields/Form';
import Submit from '../../components/FormikFields/Submit';
import DatePicker from '../../components/FormikFields/DatePicker';
import { IPutServices, emptyServices, IPutMoveService } from '../../interfaces/IService';
import MoveInBuilding from '../Customer/MoveInBuilding';
import Select from '../../components/FormikFields/Select';
import MoveOut from '../../components/FormikFields/Bundled/MoveOut';
import { IOrderPosition } from '../../interfaces/IShop';
import { IProduct } from '../../interfaces/IProduct';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { FormattedNumber, FormattedMessage } from 'react-intl';
import SelectGridItem from '../../components/ShopElements/SelectGridItem';


const styles = (theme: Theme) =>
  createStyles({

  })

interface Values {
  Items: IOrderPosition[]
}

interface Props extends WithResourceProps, WithStyles<typeof styles> {
  onChangeAndSave: (data: IPutMoveService) => void
}


const CustomTableRow = withStyles(theme => ({
  [theme.breakpoints.down("sm")]: {
    root: {
      height: 24,
    },
  }
}))(TableRow)

class MoveShop extends React.Component<Props & FormikProps<Values>, {}> {
  addItemToList = (product: IProduct) => {
    const { handleChange, values } = this.props

    let items = values.Items

    // Merge item with new Products
    let itemNotInList = true
    items = items.map(item => {
      if(item.ProductId == product.ProductId) {
        itemNotInList = false
        return { ...item, Amount: item.Amount + 1}
      } else {
        return item
      }
    })

    if (itemNotInList) {
      const order: IOrderPosition = { Amount: 1, IsForFree: false, IsRent: false, OrderPositionId: 1, ProductId: product.ProductId }
      items.push(order)
    }

    handleChange({ target: { value: items, name: "Items" } })
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

  removeOneItem = (item: IOrderPosition) => {

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

    } = this.props

    const ShopProducts = selectedCompany.ShopProducts
    console.log()
    // const { data } = this.props

    console.log(this.props)
    return (
      <Grid item xs={12}>
        <Form>
          <Grid item xs={12}>
            <IntlTypography variant="h5">SHOP</IntlTypography>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              {ShopProducts.map((product, index) => (
                <SelectGridItem product={product} onSelectProduct={(amount) => this.addItemToList(product)} />
              ))}
            </Grid>
          </Grid>


          <Field name="moveService.MoveDate" label="MOVE_DATE" component={DatePicker} />

          <Grid item xs={12}>
            <Tabs
              value={0}
              // onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
              <Tab label="Umzug" />
              <Tab label="Enstorgung" />
              <Tab label="Lager" />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <FieldArray
              name="Items"
              render={(arrayHelpers: ArrayHelpers) => (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="right">QT.</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {values.Items && values.Items.length > 0 ? (
                      values.Items.map((item, index) => {
                        const product = this.getCorrespondingProduct(item)
                        return (

                        <CustomTableRow key={index}>
                          <TableCell>{product.NameTextKey}</TableCell>
                          <TableCell align="right">{item.Amount} Stk.</TableCell>
                            <TableCell align="right">
                              <FormattedNumber
                                value={product.RentPrice * item.Amount}
                                style="currency"
                                currency="CHF"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => this.removeOneItem(item)} // remove a friend from the list
                              >
                                <RemoveCircleOutlineIcon />

                              </IconButton>
                              <IconButton
                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                              >
                                <DeleteForeverIcon />
                              </IconButton>
                            </TableCell>
                        </CustomTableRow>
                      )})
                    ) : "No items added"}
                  </TableBody>
                </Table>
              )}
            />
          </Grid>


          {/* MoveOut */}
          {/* <AddressField
            value={Address}
            name="Address"
            onChange={this.handleChange}
          /> */}

          {status && status.msg && <div>{status.msg}</div>}

          <Submit isSubmitting={isSubmitting}></Submit>
        </Form>
      </Grid>
    )
  }
}

export default withStyles(styles, {name: "MoveShop"})(
  withResource(
    withFormik<Props, Values>({
      validationSchema: Yup.object().shape({
        // email: Yup.string()
        //   .email()
        //   .required(),
      }),

      mapPropsToValues: props => ({ Items: [] }),

      handleSubmit: async (values, actions) => {
        console.log(values)
        // actions.props.
        // await actions.props.onChangeAndSave(values)

        actions.setSubmitting(false)
      }

    })(MoveShop)
  )
)

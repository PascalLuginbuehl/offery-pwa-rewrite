import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, ButtonBase, Paper, IconButton, TextField as MuiTextfield } from '@material-ui/core'
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
import { IOrderPosition, CurrentlyOpenStateEnum, IMaterialOrder, ShopTypeEnum } from '../../interfaces/IShop';
import { IProduct } from '../../interfaces/IProduct';
import Filter9PlusIcon from '@material-ui/icons/Filter9Plus'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { FormattedNumber, FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import SelectGridItem from '../../components/ShopElements/SelectGridItem';
import InventoryCategoryFolder from '../../components/Inventory/InventoryCategoryFolder';
import { IFurnitureCategory, IFurniture } from '../../interfaces/IResource';
import InventoryItems from '../../components/Inventory/InventoryItems';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import chunk from 'chunk'
import SwipeableViews from 'react-swipeable-views';

const styles = (theme: Theme) =>
  createStyles({

  })



interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps {
  onChangeAndSave: (data: IMaterialOrder) => void,
  shopTypeKey: ShopTypeEnum,
  materialOrder: IMaterialOrder,
}

interface State {
  currentlyOpen: CurrentlyOpenStateEnum
  selectedFurnitureCategory: IFurnitureCategory | null
}

class Inventory extends React.Component<Props & FormikProps<IMaterialOrder>, State> {

  state: State = {
    currentlyOpen: CurrentlyOpenStateEnum.Buy,
    selectedFurnitureCategory: null
  }



  handleTabChange = (e: React.ChangeEvent<{}>, value: CurrentlyOpenStateEnum) => {
    this.setState({ currentlyOpen: value })
  }

  getSelectedList = (): IOrderPosition[] => {
    const { shopTypeKey, values } = this.props

    return values[shopTypeKey]
  }

  openCatergory = (category: IFurnitureCategory | null) => {
    this.setState({selectedFurnitureCategory: category})
  }

  addFurniture = (furniture: IFurniture) => {

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

    const { currentlyOpen, selectedFurnitureCategory } = this.state
    const FurnitureCategories = resource.FurnitureCategories

    return (
      <Grid item xs={12}>
        <Form>
          <Grid item xs={12}>
            <IntlTypography variant="h5">MATERIAL_SHOP</IntlTypography>
          </Grid>

          <Grid item xs={12}>

            <IconButton onClick={() => this.openCatergory(null)}>
              <ArrowBackIcon />
            </IconButton>

            <IntlTypography>Test</IntlTypography>



          </Grid>

          <Grid item xs={12}>

              {!selectedFurnitureCategory ?
                FurnitureCategories.map((category, index) => (
                  <InventoryCategoryFolder category={category} onSelect={() => this.openCatergory(category)} key={index} />
                ))
                :
                <SwipeableViews>
                {
                  chunk(selectedFurnitureCategory.Furnitures.map((furniture, index) => (
                  <InventoryItems furniture={furniture} onSelect={() => this.addFurniture(furniture)} key={index} />
                )), 10)
                  .map((chunkedItems, index) => <Grid container spacing={1} key={index}>{chunkedItems}</Grid>)
                  }
                </SwipeableViews>

              }

              {}
          </Grid>


          <Field name="moveService.MoveDate" label="MOVE_DATE" component={DatePicker} />

          <Grid item xs={12}>
            <Tabs
              value={currentlyOpen}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
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
                      <TableCell><FormattedMessage id="ITEM" /></TableCell>
                      <TableCell align="right"><FormattedMessage id="QUANTITY" /></TableCell>
                      <TableCell align="right"><FormattedMessage id="PRICE" /></TableCell>
                      <TableCell align="center"><FormattedMessage id="ACTIONS" /></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* {selectedItemList && selectedItemList.length > 0 ? (
                      selectedItemList
                        .map((item, index) => ({ originalIndex: index, ...item }))
                        .filter(this.filterShowList(currentlyOpen))
                        .map((item) => {
                          const product = this.getCorrespondingProduct(item)
                          return (

                            <TableRow key={item.originalIndex}>
                              <TableCell><FormattedMessage id={product.NameTextKey} /></TableCell>
                              <TableCell align="right">{item.Amount} Stk.</TableCell>
                              <TableCell align="right">
                                {
                                  currentlyOpen != CurrentlyOpenStateEnum.Free ?
                                    <FormattedNumber
                                      value={
                                        (currentlyOpen == CurrentlyOpenStateEnum.Rent ? product.RentPrice : product.SellPrice)
                                        * item.Amount
                                      }
                                      style="currency"
                                      currency="CHF"
                                    />
                                    :
                                    "-"
                                }
                              </TableCell>

                              <TableCell padding="none" align="center" style={{ whiteSpace: "nowrap" }}>
                                <IconButton
                                  onClick={() => this.removeOneItem(item.originalIndex)}
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>

                                <IconButton
                                  onClick={() => arrayHelpers.remove(item.originalIndex)}
                                >
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
                      )} */}
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
    withStyles(styles, { name: "MoveShop" })(
      withResource(
        withFormik<Props, IMaterialOrder>({
          validationSchema: Yup.object().shape({
            // email: Yup.string()
            //   .email()
            //   .required(),
          }),

          mapPropsToValues: props => props.materialOrder,

          handleSubmit: async (values, actions) => {
            console.log(values)
            // actions.props.
            await actions.props.onChangeAndSave(values)

            actions.setSubmitting(false)
          }

        })(Inventory)
      )
    )
  )

import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles, Grid, Button, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, ButtonBase, Paper, IconButton, TextField as MuiTextfield, Toolbar, Divider, Chip } from '@material-ui/core'
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
import { Formik, FormikProps, Field, FieldProps, ErrorMessage, withFormik, InjectedFormikProps, ArrayHelpers, FieldArray } from 'formik';
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
import withWidth, { WithWidthProps, isWidthUp, isWidthDown } from '@material-ui/core/withWidth'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { IInventars, InventoryKeysEnum, IInventar } from '../../interfaces/IInventars'
import clsx from 'clsx';
import PageHeader from '../../components/PageHeader';

const styles = (theme: Theme) =>
  createStyles({
    next: {
      position: "absolute"
    },
    nextLeft: {
      left: 0
    },
    nextRight: {
      right: 0
    },
    centeredNavigationContainer: {
      position: "relative",
      display: "flex",
      justifyContent: "center",
    }
  })



interface Props extends WithResourceProps, WithStyles<typeof styles>, InjectedIntlProps, WithWidthProps {
  onChangeAndSave: (data: IInventars) => void,
  initalInventoryTypeKey: InventoryKeysEnum,
  inventory: IInventars,
}

interface State {
  currentlyOpenInventory: InventoryKeysEnum
  selectedFurnitureCategory: IFurnitureCategory | null
  index: number
}

class Inventory extends React.Component<Props & FormikProps<IInventars>, State> {

  state: State = {
    currentlyOpenInventory: InventoryKeysEnum.Move,
    selectedFurnitureCategory: null,
    index: 0,
  }

  constructor(props: Props & FormikProps<IInventars>) {
    super(props)

    this.state.currentlyOpenInventory = props.initalInventoryTypeKey
  }

  handleTabChange = (e: React.ChangeEvent<{}>, value: InventoryKeysEnum) => {
    this.setState({ currentlyOpenInventory: value })
  }

  // getSelectedList = (): IOrderPosition[] => {
  //   const { shopTypeKey, values } = this.props

  //   return values[shopTypeKey]
  // }

  openCatergory = (category: IFurnitureCategory | null) => {
    this.setState({selectedFurnitureCategory: category})
  }

  addFurniture = (furniture: IFurniture, arrayHelpers: ArrayHelpers, selectedSizeId: number | null, selectedMaterialId: number | null) => {
    const { handleChange, values } = this.props
    const { currentlyOpenInventory } = this.state

    let items = this.getSelectedList()

    const itemIndex = items.findIndex(item =>
      item.FurnitureId == furniture.FurnitureId
      && item.FSize && item.FSize.FSizeId == selectedSizeId
      && item.FMaterial && item.FMaterial.FMaterialId == selectedMaterialId
    )


    // Item not found
    if (itemIndex === -1) {
      const size = furniture.FSizes.find(size => size.FSizeId == selectedSizeId)
      const material = furniture.FMaterials.find(material => material.FMaterialId == selectedMaterialId)


      const order: IInventar = {
        Amount: 1,
        FSize: size ? size : null,
        FMaterial: material ? material : null,
        FurnitureId: furniture.FurnitureId
      }

      arrayHelpers.push(order)
    } else {
      const item = items[itemIndex]
      arrayHelpers.replace(itemIndex, { ...item, Amount: item.Amount + 1})
    }
  }

  handleChangeIndex = (index: number) => {
    const { selectedFurnitureCategory} = this.state

    if (selectedFurnitureCategory) {
      const pages = Math.ceil(selectedFurnitureCategory.Furnitures.length / (this.getBreakpointWith() * 3))
      if (index >= 0 && index < pages) {
        this.setState({
          index,
        })
      }
    }
  }

  handleChangeIndexPrepared = (index: number) => () => this.handleChangeIndex(index)

  getBreakpointWith = () => {
    const { width } = this.props
    if(width) {
      if (width == 'lg') {
        return 6
      } else if (isWidthDown(width, 'sm')) {
        return 4
      }
    }
    // default 3 xs
    return 3
  }

  getSelectedList = (): IInventar[] => {
    const { values } = this.props
    const { currentlyOpenInventory } = this.state

    return values[currentlyOpenInventory]
  }

  getCorrespondingFurnitureItem = (item: IInventar): IFurniture => {
    const { resource: { FurnitureCategories } } = this.props

    for (let categoryIndex = 0; categoryIndex < FurnitureCategories.length; categoryIndex++) {
      const category = FurnitureCategories[categoryIndex];

      for (let furnitureIndex = 0; furnitureIndex < category.Furnitures.length; furnitureIndex++) {
        const furniture = category.Furnitures[furnitureIndex];

        if(furniture.FurnitureId == item.FurnitureId) {
          return furniture
        }
      }
    }

    throw new Error("Furniture not found")
  }

  removeOneitem = (item: IInventar, index: number, arrayHelpers: ArrayHelpers) => {
    if(item.Amount > 1) {
      arrayHelpers.replace(index, {...item, Amount: item.Amount - 1})
    } else {
      arrayHelpers.remove(index)
    }
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
      width,
      classes,
    } = this.props

    const selectedItemList = this.getSelectedList()

    const { currentlyOpenInventory, selectedFurnitureCategory, index } = this.state
    const FurnitureCategories = resource.FurnitureCategories

    return (
      <Grid item xs={12}>
        <Form>
          <PageHeader title="INVENTORY"/>

          <Grid item xs={12}>
            <Toolbar disableGutters>
              <IconButton onClick={() => this.openCatergory(null)}>
                <ArrowBackIcon />
              </IconButton>
              &nbsp;

              <IntlTypography variant="h6">{selectedFurnitureCategory ? selectedFurnitureCategory.NameTextKey : "SELECT_CATEGORY" }</IntlTypography>
            </Toolbar>
            <Divider />
          </Grid>

          <Grid item xs={12} style={{width: "calc(7vw - 5px)"}}>
              {!selectedFurnitureCategory ?
                <Grid container spacing={1} key={index}>
                  {FurnitureCategories.map((category, index) => (
                    <InventoryCategoryFolder category={category} onSelect={() => this.openCatergory(category)} key={index} />
                  ))}
                </Grid>
                :
                <FieldArray
                  name={currentlyOpenInventory}
                  render={(arrayHelpers: ArrayHelpers) => (
                  <>
                    <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
                      {
                        chunk(selectedFurnitureCategory.Furnitures.map((furniture, index) => (
                          <InventoryItems furniture={furniture} onSelect={(selectedSizeId: number | null, selectedMaterialId: number | null) => this.addFurniture(furniture, arrayHelpers, selectedSizeId, selectedMaterialId)} key={index} />
                        )), this.getBreakpointWith() * 3)
                            .map((chunkedItems, index) => <div key={index}><Grid style={{ margin: 0, width: "100%" }} container spacing={1}>{chunkedItems}</Grid></div>)
                      }
                    </SwipeableViews>

                    <div className={classes.centeredNavigationContainer}>
                      <IconButton onClick={this.handleChangeIndexPrepared(index - 1)} size="small" className={clsx(classes.next, classes.nextLeft)}><ChevronLeftIcon /></IconButton>
                      {
                        new Array(Math.ceil(selectedFurnitureCategory.Furnitures.length / (this.getBreakpointWith() * 3))).fill(null).map((e, i) => {
                          if(index == i) {
                            return <RadioButtonCheckedIcon key={i} onClick={this.handleChangeIndexPrepared(i)}/>
                          } else {
                            return <RadioButtonUncheckedIcon key={i} onClick={this.handleChangeIndexPrepared(i)}/>
                          }
                        })
                      }
                      <IconButton onClick={this.handleChangeIndexPrepared(index + 1)} size="small" className={clsx(classes.next, classes.nextRight)}><ChevronRightIcon /></IconButton>
                    </div>
                  </>
                  )}
                />
              }
          </Grid>
          <Grid item xs={12}>
            <Tabs
              value={currentlyOpenInventory}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
              <Tab label={intl.formatMessage({ id: "MOVE" })} value={InventoryKeysEnum.Move} />
              <Tab label={intl.formatMessage({ id: "DISPOSAL" })} value={InventoryKeysEnum.Disposal} />
              <Tab label={intl.formatMessage({ id: "STORAGE" })} value={InventoryKeysEnum.Storage} />
            </Tabs>
          </Grid>

          <Grid item xs={12}>
            <FieldArray
              name={currentlyOpenInventory}
              render={(arrayHelpers: ArrayHelpers) => (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"><FormattedMessage id="ITEM" /></TableCell>
                      <TableCell align="right" padding="checkbox"><FormattedMessage id="QUANTITY" /></TableCell>
                      <TableCell align="center" padding="checkbox"><FormattedMessage id="ACTIONS" /></TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {selectedItemList && selectedItemList.length > 0 ? (
                      selectedItemList
                        .map((item, index) => ({ originalIndex: index, ...item }))
                        // .filter(this.filterShowList(currentlyOpen))
                        .map((item) => {
                          const furniture = this.getCorrespondingFurnitureItem(item)
                          return (

                            <TableRow key={item.originalIndex}>
                              <TableCell>
                                <FormattedMessage id={furniture.NameTextKey} />

                                {item.FSize ? <Chip size="small" label={intl.formatMessage({ id: item.FSize.NameTextKey })} /> : null}
                                {item.FMaterial ? <Chip size="small" label={intl.formatMessage({ id: item.FMaterial.NameTextKey })} /> : null}
                              </TableCell>

                              <TableCell align="right">{item.Amount} Stk.</TableCell>

                              <TableCell padding="none" align="center" style={{ whiteSpace: "nowrap" }}>
                                <IconButton
                                  onClick={() => this.removeOneitem(item, item.originalIndex, arrayHelpers)}
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
  withWidth()(
    injectIntl(
      withStyles(styles, { name: "MoveShop" })(
        withResource(
          withFormik<Props, IInventars>({
            validationSchema: Yup.object().shape({
              // email: Yup.string()
              //   .email()
              //   .required(),
            }),

            mapPropsToValues: props => props.inventory,

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
  )

import React, { useEffect, useState } from "react"
import BuildingEdit from "../../../components/FormikFields/Bundled/BuildingEdit"

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, createStyles, Theme } from "@material-ui/core"
import { IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { Formik } from "formik"
import { IResource } from "../../../interfaces/IResource"
import { makeStyles } from "@material-ui/styles"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { green } from "@material-ui/core/colors"
import IntlTypography from "../../../components/Intl/IntlTypography"
import Submit from "../../../components/FormikFields/Submit"
import { CompanyBuildingSettingDTO } from "../../../models"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
    },

    successGreen: {
      backgroundColor: green[400],
      transition: "background .5s linear",
    },

    fadeOut: {
      transition: "background 2s linear",
    }
  })
)

interface Props {
  buildingId: number | null
  saveBuilding: (building: IBuilding) => Promise<any>
  buildings: IBuilding[]
  resource: IResource
  buildingSetting: CompanyBuildingSettingDTO
}

export default function NestedBuildingEdit(props: Props) {
  const { buildings, saveBuilding, buildingId, resource, buildingSetting} = props

  const [expandOpen, setExpanded] = useState<boolean>(false)
  const [showSuccess, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    console.log("ReInizializing")
  }, [buildingId])

  const classes = useStyles()

  // useEffect()
  const initalBuilding = buildings.find((building) => building.BuildingId === buildingId)

  if (buildingId === null || initalBuilding === undefined) {
    return (
      <Grid item xs={12}>
        <ExpansionPanel
          disabled
          expanded={expandOpen}
          onChange={(e, expanded) => setExpanded(expanded)}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <IntlTypography>NO_BUILDING_SELECTED</IntlTypography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </Grid>
    )
  }

  return (
    <Grid item xs={12}>
      <ExpansionPanel
        classes={{root: showSuccess ? classes.successGreen : classes.fadeOut}}
        expanded={expandOpen}
        onChange={(e, expanded) => setExpanded(expanded)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <IntlTypography>EDIT_BUILDING</IntlTypography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails classes={{ root: classes.root }}>
          <Formik<IBuilding>
            initialValues={initalBuilding}
            enableReinitialize
            onSubmit={async (values, actions) => {
              try {
                await saveBuilding(values)

                actions.setSubmitting(false)
                actions.resetForm()

                setExpanded(false)
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
              } catch (e) {
                console.log(e)
                actions.setStatus(e)
              }
            }}
          >
            {({isSubmitting}) => (
              <Form disableSubmit>
                <BuildingEdit resource={resource} buildingSetting={buildingSetting}/>
                <Submit isSubmitting={isSubmitting} stayInline label="SAVE_BUILDING"></Submit>
              </Form>
            )}
          </Formik>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  )
}

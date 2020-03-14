import React, { useEffect } from "react"
import BuildingEdit from "../../../components/FormikFields/Bundled/BuildingEdit"

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Grid } from "@material-ui/core"
import { IBuilding } from "../../../interfaces/IBuilding"
import Form from "../../../components/FormikFields/Form"
import { Formik } from "formik"
import { IResource } from "../../../interfaces/IResource"

interface Props {
  buildingId: number | null
  saveBuildings: (buildings: IBuilding[]) => Promise <any>
  buildings: IBuilding[]
  resource: IResource
}

export default function NestedBuildingEdit(props: Props) {
  const { buildings, saveBuildings, buildingId, resource} = props

  useEffect(() => {
    console.log("ReInizializing")
  }, [buildingId])


  // useEffect()
  const initalBuilding = buildings.find((building) => building.BuildingId === buildingId)

  if (buildingId === null || initalBuilding === undefined) {
    return (
      <Grid item xs={12}>
        <ExpansionPanel disabled>
          <ExpansionPanelSummary>
            <Typography>No Building Selected</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </Grid>
    )
  }


  return (
    <Grid item xs={12}>
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <Typography>Edit building here</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Formik<IBuilding>
            initialValues={initalBuilding}
            enableReinitialize
            onSubmit={(values, actions) => {
              // onSave(values)

              actions.setSubmitting(false)
              actions.resetForm()
            }}
          >
            <Form>
              <BuildingEdit prefix={""} resource={resource} />
            </Form>
          </Formik>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Grid>
  )
}

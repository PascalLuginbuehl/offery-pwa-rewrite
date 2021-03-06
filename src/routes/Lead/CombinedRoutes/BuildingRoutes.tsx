import React from "react"
import { Route, useHistory } from "react-router"
import NewCustomer from "../Customer"
import LeadAPI, { ILeadContainer } from "../LeadAPI"
import EmailConfirmation from "../Customer/EmailConfirmation"
import { emptyBuilding, IBuilding } from "../../../interfaces/IBuilding"
import {  ILead } from "../../../interfaces/ILead"
import OfflineUnavailable from "../../../components/OfflineUnavailable"

import Building from "../Customer/Building"
import BuildingsOverview from "../Customer/BuildingsOverview"
import Notes from "../InternalNotes"
import GeneralCommunication from "../InternalNotes/GeneralCommunication"
import EmailSent from "../InternalNotes/EmailSent"

interface Props {
  leadContainer: ILeadContainer
  handleChangeAndSave: (value: any, name: keyof ILeadContainer, savePromise: () => Promise<any>) => Promise<void>
  redirectToNextPage: (currentUrl: string) => () => void
  matchUrl: string
  handleChange: (value: any, name: keyof ILeadContainer) => void
  offline: boolean
}

export default function BuidlingRoutes({ leadContainer, redirectToNextPage, matchUrl, handleChangeAndSave, handleChange, offline}: Props) {
  const { Lead, buildings } = leadContainer
  const history = useHistory()

  return (
    <>

      <Route
        exact
        path={`${matchUrl}/notes`}
        render={routeProps => (
          <Notes
            {...routeProps}
            lead={Lead}
            onChangeAndSave={lead => {
              // Fixing PostLead to Lead back together
              return handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead as ILead))
            }}
            nextPage={redirectToNextPage("/customer")}
          />
        )}
      />

      <Route
        exact
        path={`${matchUrl}/customer`}
        render={routeProps => (
          <NewCustomer
            {...routeProps}
            lead={Lead}
            onChangeAndSave={lead => {
              // Fixing PostLead to Lead back together
              return handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead as ILead))
            }}
            nextPage={redirectToNextPage("/customer")}
          />
        )}
      />

      <Route
        exact
        path={`${matchUrl}/building/new`}
        render={routeProps => (
          <OfflineUnavailable offline={offline} nextPage={redirectToNextPage("/building/new")}>
            <Building
              building={emptyBuilding}
              {...routeProps}
              onChangeAndSave={async (building) => {
                const buildings = await LeadAPI.CreateBuilding(Lead.LeadId, building)

                return handleChangeAndSave(buildings, "buildings", () => Promise.resolve(buildings))
              }}

              nextPage={redirectToNextPage("/building/new")}
            />
          </OfflineUnavailable>
        )}
      />

      {buildings.map((building, buildingIndex) => (
        <Route
          exact
          key={buildingIndex}
          path={`${matchUrl}/building/${building.BuildingId}`}
          render={(routeProps) => {

            return (
              <Building
                building={building}
                {...routeProps}
                onChangeAndSave={(building) => {
                  const newBuildings = [...buildings]

                  newBuildings[buildingIndex] = building as IBuilding

                  return handleChangeAndSave(newBuildings, "buildings", () => LeadAPI.SaveBuildings(Lead.LeadId, newBuildings))
                }}
                nextPage={redirectToNextPage("/building/new")}
              />
            )
          }
          }
        />
      ))}

      <Route
        exact
        path={`${matchUrl}/building/`}
        render={routeProps => (
          <BuildingsOverview
            handleChange={(buildings: IBuilding[]) => handleChange(buildings, "buildings")}
            {...routeProps}
            buildings={buildings}

            nextPage={redirectToNextPage("/building")}
          />
        )}
      />

      {/* E-Mail confirmation */}
      <Route
        exact
        path={`${matchUrl}/building/email-confirmation`}
        render={routeProps =>
          <OfflineUnavailable offline={offline} nextPage={redirectToNextPage("/building/email-confirmation")}>
            <EmailConfirmation
              offline={offline}
              {...routeProps}
              lead={Lead}
              buildings={buildings}
              nextPage={redirectToNextPage("/building/email-confirmation")}

              onChangeAndSave={lead => {
                // Fixing PostLead to Lead back together
                return handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead as ILead))
              }}
            />
          </OfflineUnavailable>
        }
      />

      {/* E-Mail confirmation */}
      <Route
        exact
        path={`${matchUrl}/general-communication`}
        render={routeProps =>
          <OfflineUnavailable offline={offline} nextPage={redirectToNextPage("/general-communication")}>
            <GeneralCommunication
              {...routeProps}
              lead={Lead}

              nextPage={() => history.push("/lead/" + Lead.LeadId + "/email-sent")}
              onChangeAndSave={lead => {
                // Fixing PostLead to Lead back together
                return handleChangeAndSave(lead, "Lead", () => LeadAPI.SaveLead(lead as ILead))
              }}
            />
          </OfflineUnavailable>
        }
      />

      <Route exact path={`${matchUrl}/email-sent`} render={routeProps =>
        <OfflineUnavailable offline={offline}>
          <EmailSent {...routeProps} lead={Lead} />
        </OfflineUnavailable>
      } />
    </>
  )
}

import React from "react"
import UpdateServiceWorker from "./components/UpdateServiceWorker"
import { Route, Switch } from "react-router-dom"
import LeadRoutes from "./routes"
import Container from "./components/Container"

import CompanySettings from "./components/CompanySettings"

interface Props {
  swUpdateEventGenerator: Promise<ServiceWorkerRegistration>
}

export default function App(props: Props) {
  const { swUpdateEventGenerator } = props

  return (
    <Container>
      <Switch>
        <Route path="/company">
          <CompanySettings />
        </Route>

        <LeadRoutes />
      </Switch>


      <UpdateServiceWorker swUpdateEventGenerator={swUpdateEventGenerator} />
    </Container>
  )
}

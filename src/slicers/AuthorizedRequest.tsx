import LoginService from "../services/LoginService"


export async function authorizedFetch<T>(input: string, init?: RequestInit): Promise<T> {
  const defaultFetchParams: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }

  let response: Response
  try {

    response = await fetch(`${process.env.REACT_APP_API_URL}/${input}`, await LoginService.authorizeRequest({ ...defaultFetchParams, ...init }))
  } catch (e) {
    // TypeError: Failed to fetch / net::ERR_CONNECTION_REFUSED
    throw new Error(`The server is not reachable`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: T
  try {
    // may throw an error if there is no body
    json = await response.json() as T
  } catch (e) {
    throw new Error(`Unexpected server response: ${response.statusText} (Status:${response.status})`)
  }
  // console.log(json)

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return json
}

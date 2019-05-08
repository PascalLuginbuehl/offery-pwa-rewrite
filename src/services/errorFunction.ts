export function errorFunction(response: Response) {
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return response
}

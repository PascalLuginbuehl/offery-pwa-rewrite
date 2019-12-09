export async function errorFunction (response: Response) {
  if (!response.ok) {
    const json = await response.json()
    if (json) {
      throw {statusText: response.statusText, json}
    } else {
      throw { statusText: response.statusText }

    }
  }
  return response
}

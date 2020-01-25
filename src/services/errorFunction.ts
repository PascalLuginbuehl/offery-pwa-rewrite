export async function errorFunction (response: Response) {
  if (!response.ok) {
    const json = await response.text().then(function(text) {
      return text ? JSON.parse(text) : {}
    })
    if (json) {
      throw {statusText: response.statusText, json}
    } else {
      throw { statusText: response.statusText }

    }
  }
  return response
}

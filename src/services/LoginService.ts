import { errorFunction } from "./errorFunction"

const API_URL = process.env.REACT_APP_API_URL


export interface LoginInformation {
  Email: string
  Password: string
}

export interface Token {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
}

class LoginService {
  private static ACCESS_TOKEN_NAME = "BEARER_TOKEN"

  // public AuthorizedFetch = async (requestUrl: string, options?: RequestInit): Promise<Response> => {
  //   try {
  //     // Empty thing correction
  //     if (!options) {
  //       options = {}
  //     }

  //     options.headers = new Headers(options.headers)

  //     // const email = this.email
  //     // if (!email) return reject("lol")
  //     // options.headers.set("EMAIL", email)

  //     options.headers.set("Accept", "application/json")
  //     options.headers.set("Content-Type", "application/json")

  //   } catch (e) {
  //     // TODO Redirect to login
  //     throw new Error("Authentication failed")
  //   }

  //   return fetch(API_URL + requestUrl, await this.authorizeRequest(options)).then(errorFunction)
  // }


  setToken(value: Token ) {
    localStorage.setItem(LoginService.ACCESS_TOKEN_NAME, JSON.stringify(value))
  }

  async getToken() {
    const storage = localStorage.getItem(LoginService.ACCESS_TOKEN_NAME)
    if (!storage) throw new Error("Token not set")

    const token: Token = JSON.parse(storage)

    if (!token) {
      throw new Error("no Token")
    }

    if (token.expires_in > Date.now()) {
      return await this.refreshToken(token.refresh_token)
    } else {

      return token.access_token
    }

  }

  private async refreshToken(oldRefreshToken: string) {
    try {
      const user = new URLSearchParams()
      user.append("refresh_token", oldRefreshToken)
      user.append("grant_type", "refresh_token")

      const token = await fetch(API_URL + "/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: user.toString(),
      })
        .then(errorFunction)
        .then((response) => response.json())
      // .then(json => this.toLead(json))

      this.setToken(token)

      return token.access_token
    } catch (e) {
      console.error(e)
      throw new Error("Token refresh failed")
    }
  }

  public async authorizeRequest(options?: RequestInit): Promise<RequestInit> {

    try {
      // Empty thing correction
      if (!options) {
        options = {}
      }

      options.headers = new Headers(options.headers)

      options.headers.set("Accept", "application/json")
      options.headers.set("Authorization", "Bearer " + await this.getToken())

      return options
    } catch (e) {
      // TODO Redirect to login
      throw new Error("Authentication failed")
    }
  }


  public async login(login: LoginInformation) {
    // if (this.token) {
    //   return resolve()
    // }
    try {
      const user = new URLSearchParams()
      user.append("username", login.Email)
      user.append("password", login.Password)
      user.append("grant_type", "password")


      const token = await fetch(API_URL + "/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: user.toString(),
      })
        .then(errorFunction)
        .then((response) => response.json())
        // .then(json => this.toLead(json))

      this.setToken(token)

      return
    } catch (e) {
      if(e.statusText === "Bad Request" && e.json && e.json.error ==="invalid_grant") {
        throw new Error("Invalid credentials")
      } else {
        throw e
      }
    }
  }
}


export default new LoginService()

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

  private set token(value: Token ) {
    localStorage.setItem(LoginService.ACCESS_TOKEN_NAME, JSON.stringify(value))
  }

  private get token(): Token {
    const storage = localStorage.getItem(LoginService.ACCESS_TOKEN_NAME)
    if (!storage) throw new Error("Token not set")

    const token: Token = JSON.parse(storage)

    if (!token) {
      throw new Error("no Token")
    }

    return token
  }

  private validateAndRefreshToken(token: Token): Promise<string> {
    return new Promise((resolve, reject) => {
      // // token.expires_in
      // // token.refresh_token
      resolve(token.access_token)
    })
  }

  public authorizeRequest(options ?: RequestInit): Promise<RequestInit> {
    return new Promise(async (resolve, reject) => {
      try {
        // Empty thing correction
        if (!options) {
          options = {}
        }

        options.headers = new Headers(options.headers)

        options.headers.set("Accept", 'application/json')
        options.headers.set("Authorization", "Bearer " + (await this.validateAndRefreshToken(this.token)))

        resolve(options)
      } catch (e) {
        // TODO Redirect to login
        reject("Authentication failed")
      }
    })
  }


  public login(login: LoginInformation) {
    return new Promise<void>(async (resolve, reject) => {
      // if (this.token) {
      //   return resolve()
      // }
      try {
        const user = new URLSearchParams()
        user.append('username', login.Email)
        user.append('password', login.Password)
        user.append('grant_type', 'password')


        const token = await fetch(API_URL + '/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          body: user.toString(),
        })
          .then(errorFunction)
          .then((response) => response.json())
          // .then(json => this.toLead(json))

        this.token = token

        resolve()
      } catch (e) {
        throw new Error("loginFailed")
        console.error(e)
      }
    })
  }
}


export default new LoginService()

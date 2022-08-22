import axios from "axios"
import config from "../config"
import { getItem, removeItem, setItem } from "./localstorage"
import jwtDecode from "jwt-decode"
import { demoPages } from "../menu"
import { useNavigate } from "react-router-dom"
import { useMst } from '../models'

const axiosApi = axios.create({
  baseURL: config.API_URL,
})

// intercepting to capture errors
axiosApi.interceptors.request.use(
  request => {
    request.headers["Content-Type"] = "application/json"
    request.headers["client-id"] = config.CLIENT_ID
    request.headers['mobile'] = false
    //request.headers['code'] = Configs.fcmCode || ''
    //request.headers['os'] = Configs.os || ''

    const accessToken = getItem("access-token")
    const refreshToken = getItem("refresh-token")

    if (accessToken) {
      let tokenData = jwtDecode(accessToken)
      request.headers["authorization"] = "Bearer " + accessToken
      request.headers["refresh-token"] = "Bearer " + refreshToken
      request.headers["user-id"] = tokenData.id
    }

    // if (accessToken && refreshToken) {
    //   let tokenData
    //   try {
    //     tokenData = jwtDecode(accessToken)
    //     request.headers["authorization"] = "Bearer " + accessToken
    //     request.headers["user-id"] = tokenData.id
    //   } catch (e) {
    //     console.log(e)
    //   }

    //   if (!tokenData) {
    //     try {
    //       tokenData = jwtDecode(refreshToken)
    //       request.headers["authorization"] = "Bearer " + accessToken
    //       request.headers["refresh-token"] = "Bearer " + refreshToken
    //       request.headers["user-id"] = tokenData.id
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   }
    // }

    return request
  },
  error => console.log(error)
)

axiosApi.interceptors.response.use(
  response => {
    if (response.data.result || response.status === 200) {
      if (response.headers["access-token"]) setItem("access-token", response.headers["access-token"])
      if (response.headers["refresh-token"]) setItem("refresh-token", response.headers["refresh-token"])
      return response.data
    } else {
      //console.log("response>>", response)
      let message
      switch (response.status) {
        case 500:
          message = "Internal Server Error"
          break
        case 401:
          message = "Invalid credentials"
          break
        case 404:
          message = "Sorry! the data you are looking for could not be found"
          break
        /* case 910:
          message = "아이디 또는 비밀번호가 틀렸습니다."
          break */
        default:
          message = response.data.error || response.data.data.error
      }
      //console.log("message>>", message)
      return Promise.reject(message)
    }
  },
  error => {    
    if (error.response) {
      //console.log(error)
      if (error.response.data && error.response.data.message) {
        if(error.response.data.code === 910) {          
          return error.response.data
        }
        //console.log('!!!')
        //console.log("error.response.data", error.response.data)
        if (error.response.data.code === 401/*  || error.response.data.code === 500 */) {
          //removeItem('access-token')
          //removeItem('refresh-token')
          endSession();
        }
      }
    }
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
)

const endSession = async () => {
  await Promise.all([
    removeItem('access-token'),
    removeItem('refresh-token'),
    removeItem('rootState'),
    removeItem('webToken'),
    removeItem('authUser'),
    //user.logout(),
    //company.logout(),
  ]).then(()=>{
    //document.location.href(`/${demoPages.login.path}`);
  })
}

class APIClient {
  /**
   * Fetches data from given url
   */
  get = (url, params) => axiosApi.get(url, params)

  /**
   * post given data to url
   */
  post = (url, data) => axiosApi.post(url, data)

  /**
   * Updates data
   */
  put = (url, data) => axiosApi.put(url, data)

  /**
   * Delete
   */
  remove = url => axiosApi.delete(url)
}

export { APIClient }


  // /**
  //  * Fetches data from given url
  //  */
  //  get = (url, params) => {
  //   try {
  //     return axiosApi.get(url, params)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // /**
  //  * post given data to url
  //  */
  // post = (url, data) => {
  //   try {
  //     return axiosApi.post(url, data)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // /**
  //  * Updates data
  //  */
  // put = (url, data) => {
  //   try {
  //     return axiosApi.put(url, data)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // /**
  //  * Delete
  //  */
  // delete = url => {
  //   try {
  //     return axiosApi.delete(url)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

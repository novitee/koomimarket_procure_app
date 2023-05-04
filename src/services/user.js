import {REACT_APP_API_URI} from "react-native-dotenv"

export const fetchMe = async () => {
  try {
    const url = `${REACT_APP_API_URI}/api/v1/storefront/me?include=outlets(name, id)`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    return null
  }
}

export const verifyPhoneNumber = async ({code, number}) => {
  try {
    const url = `${REACT_APP_API_URI}/api/v1/procure-storefront/login`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'x-application': "KOOMI_PROCURE",
        'x-role-department': "BUYER",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileCode: code,
        mobileNumber: number,
      }),
    })
    const data = await response.json()
    console.warn(data)
    return data
  } catch (error) {
    console.warn(error.message)
    return null
  }
}
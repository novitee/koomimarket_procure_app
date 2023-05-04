import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
const UserContext = React.createContext()
import {fetchMe} from "services/user"

function UserProvider(props) {
  
  const [me, setMe] = useState(undefined)
  
  async function getMe() {
    const data = await fetchMe()
    if (data?.success) {
      setMe(data?.data?.me)
    } else {
      setMe(undefined)
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  return (
    <UserContext.Provider value={{ me }}>
      {props.children}
    </UserContext.Provider>
  )
}

const UserConsumer = UserContext.Consumer

export default UserProvider
export { UserConsumer, UserContext }
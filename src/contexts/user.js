import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
const UserContext = React.createContext()
// import { isLogin as isLogged, tokenExpired, logout as userLogout, setToken } from "utils/authenticate";
// import {WEB_CLIENT_ID, IOS_CLIENT_ID} from "react-native-dotenv"

function UserProvider(props) {
  
  const [me, setMe] = useState(undefined)
  

  return (
    <UserContext.Provider value={{ me }}>
      {props.children}
    </UserContext.Provider>
  )
}

const UserConsumer = UserContext.Consumer

export default UserProvider
export { UserConsumer, UserContext }